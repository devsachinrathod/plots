-- Create custom types
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.portfolio_category AS ENUM ('photos', 'banners', 'product_design', 'logos', 'social_media', 'branding', 'packaging');
CREATE TYPE public.service_type AS ENUM ('branding', 'web_design', 'packaging', 'photography', 'social_media', 'print_design');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio table
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category portfolio_category[] NOT NULL,
  cover_url TEXT NOT NULL,
  gallery_urls TEXT[],
  summary TEXT,
  tools TEXT[],
  case_study_html TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  date_created DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  budget TEXT,
  service_type service_type,
  phone TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat threads table
CREATE TABLE public.chat_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin', 'anonymous')),
  text TEXT NOT NULL,
  image_url TEXT,
  seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table (optional)
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  cover_url TEXT,
  content_html TEXT NOT NULL,
  tags TEXT[],
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND role = 'admin'
  );
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chat_threads_updated_at BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio policies (public read, admin write)
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Only admins can insert portfolio items" ON public.portfolio FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update portfolio items" ON public.portfolio FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete portfolio items" ON public.portfolio FOR DELETE USING (public.is_admin(auth.uid()));

-- Testimonials policies (public read, admin write)
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Only admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin(auth.uid()));

-- Contacts policies (admins can see all, users can insert)
CREATE POLICY "Only admins can view contacts" ON public.contacts FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Anyone can submit contact form" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can update contacts" ON public.contacts FOR UPDATE USING (public.is_admin(auth.uid()));

-- Chat threads policies
CREATE POLICY "Users can view own threads, admins see all" ON public.chat_threads 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Anyone can create threads" ON public.chat_threads 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own threads, admins update all" ON public.chat_threads 
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Messages policies
CREATE POLICY "Users can view messages in own threads, admins see all" ON public.messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_threads 
      WHERE chat_threads.id = messages.thread_id 
      AND (chat_threads.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );
CREATE POLICY "Users can send messages in own threads, admins send all" ON public.messages 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_threads 
      WHERE chat_threads.id = messages.thread_id 
      AND (chat_threads.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- Posts policies (public read, admin write)
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Only admins can insert posts" ON public.posts FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update posts" ON public.posts FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete posts" ON public.posts FOR DELETE USING (public.is_admin(auth.uid()));

-- Enable realtime for chat
ALTER TABLE public.chat_threads REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;