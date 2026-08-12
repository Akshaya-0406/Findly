-- SQL Schema Initialization for Findly Lost & Found Database
-- Targets Supabase PostgreSQL Database (Phase 5 & Phase 6 Complete)

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'moderator', 'admin')),
  is_suspended BOOLEAN DEFAULT false NOT NULL,
  suspended_until TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 2. ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'pending_claim', 'claimed', 'returned', 'closed')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  date DATE NOT NULL,
  time TEXT,
  color TEXT,
  brand TEXT,
  model TEXT,
  identifying_features TEXT,
  reward NUMERIC,
  additional_notes TEXT,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active items" ON public.items
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create items" ON public.items
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    COALESCE((SELECT is_suspended FROM public.profiles WHERE id = auth.uid()), false) = false
  );

CREATE POLICY "Allow reporters or admins/moderators to update items" ON public.items
  FOR UPDATE USING (
    auth.uid() = reporter_id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow reporters or admins/moderators to delete items" ON public.items
  FOR DELETE USING (
    auth.uid() = reporter_id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

-- 3. ITEM IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.item_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to item images" ON public.item_images
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert item images" ON public.item_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow item owners to delete item images" ON public.item_images
  FOR DELETE USING (
    auth.uid() IN (SELECT reporter_id FROM public.items WHERE id = item_id) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

-- 4. SAVED ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own saved items" ON public.saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to save items for themselves" ON public.saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to unsave their own items" ON public.saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- 5. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  participant_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(item_id, participant_1, participant_2)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow participants to view conversations" ON public.conversations
  FOR SELECT USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2 OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow authenticated non-blocked users to start conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    (auth.uid() = participant_1 OR auth.uid() = participant_2) AND
    COALESCE((SELECT is_suspended FROM public.profiles WHERE id = auth.uid()), false) = false
  );

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow participants to read conversation messages" ON public.messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT participant_1 FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT participant_2 FROM public.conversations WHERE id = conversation_id
    ) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow non-suspended participants to post messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT participant_1 FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT participant_2 FROM public.conversations WHERE id = conversation_id
    ) AND
    COALESCE((SELECT is_suspended FROM public.profiles WHERE id = auth.uid()), false) = false
  );

CREATE POLICY "Allow message recipient to mark as read" ON public.messages
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT participant_1 FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT participant_2 FROM public.conversations WHERE id = conversation_id
    )
  );

-- 7. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow reporters to view their own reports" ON public.reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow authenticated users to create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Allow moderators or admins to update reports" ON public.reports
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

-- 8. BLOCKED USERS TABLE
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(blocker_id, blocked_user_id),
  CONSTRAINT no_self_block CHECK (blocker_id <> blocked_user_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own blocks" ON public.blocked_users
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Allow users to block others" ON public.blocked_users
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Allow users to unblock" ON public.blocked_users
  FOR DELETE USING (auth.uid() = blocker_id);

-- 9. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage categories" ON public.categories
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 10. ADMIN ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins and moderators to view activity logs" ON public.admin_activity_logs
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow admins and moderators to insert activity logs" ON public.admin_activity_logs
  FOR INSERT WITH CHECK (
    auth.uid() = admin_id AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

-- 11. CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  claimant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(item_id, claimant_id)
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view claims they made or received" ON public.claims
  FOR SELECT USING (
    auth.uid() = claimant_id OR 
    auth.uid() IN (SELECT reporter_id FROM public.items WHERE id = item_id) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

CREATE POLICY "Allow authenticated non-suspended users to submit claims" ON public.claims
  FOR INSERT WITH CHECK (
    auth.uid() = claimant_id AND
    COALESCE((SELECT is_suspended FROM public.profiles WHERE id = auth.uid()), false) = false
  );

CREATE POLICY "Allow item reporters, claimants or admins to update claim status" ON public.claims
  FOR UPDATE USING (
    auth.uid() = claimant_id OR 
    auth.uid() IN (SELECT reporter_id FROM public.items WHERE id = item_id) OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('moderator', 'admin')
  );

-- 12. AUTOMATED PROFILE SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime for conversations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
