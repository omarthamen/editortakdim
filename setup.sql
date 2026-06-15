-- ===========================================================
--  Editor Hiring — إعداد قاعدة البيانات
--  شغّله في Supabase SQL Editor
-- ===========================================================

-- جدول طلبات المونتيرز
CREATE TABLE IF NOT EXISTS public.editor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  portfolio text NOT NULL,
  test_video text,
  notes text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.editor_applications ENABLE ROW LEVEL SECURITY;

-- السياسات:
-- 1. أي شخص يقدر يرسل طلب (INSERT)
DROP POLICY IF EXISTS "anyone can apply" ON public.editor_applications;
CREATE POLICY "anyone can apply" ON public.editor_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 2. المستخدمين المسجلين فقط يشوفون الطلبات
DROP POLICY IF EXISTS "authenticated read" ON public.editor_applications;
CREATE POLICY "authenticated read" ON public.editor_applications
  FOR SELECT TO authenticated
  USING (true);

-- 3. المستخدمين المسجلين يعدّلون الطلبات
DROP POLICY IF EXISTS "authenticated update" ON public.editor_applications;
CREATE POLICY "authenticated update" ON public.editor_applications
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- 4. المستخدمين المسجلين يحذفون الطلبات
DROP POLICY IF EXISTS "authenticated delete" ON public.editor_applications;
CREATE POLICY "authenticated delete" ON public.editor_applications
  FOR DELETE TO authenticated
  USING (true);

-- تم ✅
--
-- الخطوة التالية: أنشئ حساب لأمين من Supabase Dashboard:
-- Authentication > Users > Add User
-- Email: (الإيميل اللي تبيه)
-- Password: (كلمة سر قوية)
