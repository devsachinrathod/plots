import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
    serviceType: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceTypeMap: { [key: string]: any } = {
        'Brand Identity': 'branding',
        'Web Design': 'web_design',
        'Packaging Design': 'packaging',
        'Photography': 'photography',
        'Social Media': 'social_media',
        'Print Design': 'print_design',
        'Consultation': null,
      };

      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            budget: formData.budget || null,
            service_type: serviceTypeMap[formData.serviceType] || null,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
        budget: "",
        serviceType: "",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@creativestudio.com",
      href: "mailto:hello@creativestudio.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      href: "#"
    },
  ];

  const serviceTypes = [
    "Brand Identity",
    "Web Design",
    "Packaging Design",
    "Photography",
    "Social Media",
    "Print Design",
    "Consultation"
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Let's discuss your project and 
            create something extraordinary together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="animate-slide-up shadow-large">
            <CardHeader>
              <CardTitle className="text-2xl">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Service Type</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes.map((service) => (
                      <Badge
                        key={service}
                        variant={formData.serviceType === service ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => setFormData({ ...formData, serviceType: service })}
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <Input
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., $5,000 - $10,000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me about your project..."
                    rows={5}
                  />
                </div>

                  <Button 
                    type="submit" 
                    variant="cta" 
                    size="lg" 
                    className="w-full"
                    disabled={loading}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="animate-scale-in space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                I'm always excited to discuss new projects and opportunities. 
                Whether you have a specific brief or just an idea you'd like to explore, 
                I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <Card key={info.label} className="hover:shadow-medium transition-shadow">
                    <CardContent className="p-6">
                      <a
                        href={info.href}
                        className="flex items-center space-x-4 group"
                      >
                        <div className="w-12 h-12 bg-accent-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
                          <IconComponent className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{info.label}</div>
                          <div className="text-lg font-medium group-hover:text-accent transition-colors">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Response Time</h4>
                <p className="text-muted-foreground">
                  I typically respond to all inquiries within 24 hours. 
                  For urgent projects, feel free to call directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;