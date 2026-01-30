import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender_type: 'user' | 'admin' | 'anonymous';
  created_at: string;
  sender_id?: string;
  image_url?: string;
  seen: boolean;
  thread_id: string;
}

interface ChatThread {
  id: string;
  user_name?: string;
  user_email?: string;
  unread_count: number;
}

const RealTimeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showContactForm, setShowContactForm] = useState(true);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (threadId) {
      // Set up real-time subscription for messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [threadId]);

  const createThread = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email to start chatting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .insert([
          {
            user_id: user?.id || null,
            user_name: userName,
            user_email: userEmail,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setThreadId(data.id);
      setShowContactForm(false);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !threadId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            thread_id: threadId,
            sender_id: user?.id || null,
            sender_type: user ? (isAdmin ? 'admin' : 'user') : 'anonymous',
            text: newMessage.trim(),
          }
        ]);

      if (error) throw error;

      // Update thread's last message
      await supabase
        .from('chat_threads')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', threadId);

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const loadMessages = async () => {
    if (!threadId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    if (threadId) {
      loadMessages();
    }
  }, [threadId]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-large hover:shadow-xl transition-all duration-300"
          variant="cta"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 shadow-large">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-lg">Chat Support</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex flex-col h-80 p-0">
          {showContactForm && !threadId ? (
            <div className="p-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Hi! 👋 Let's start a conversation. Please share your details:
              </div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <Button
                  onClick={createThread}
                  variant="cta"
                  className="w-full"
                >
                  Start Chat
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Start the conversation by sending a message below
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_type === 'admin' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.sender_type === 'admin'
                              ? 'bg-muted text-foreground'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          {message.sender_type === 'admin' && (
                            <div className="flex items-center mb-1">
                              <User className="h-3 w-3 mr-1" />
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            </div>
                          )}
                          <div>{message.text}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={loading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    size="sm"
                    variant="cta"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeChat;