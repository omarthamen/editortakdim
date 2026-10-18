# Editor Hiring

صفحة بسيطة لاستقبال طلبات المونتيرز للعمل.

## الملفات

- `index.html` + `main.js` — صفحة التقديم (Landing)
- `admin.html` + `admin.js` — لوحة تحكم لمراجعة الطلبات
- `styles.css` — الستايلات المشتركة
- `setup.sql` — إعداد قاعدة البيانات

## الإعداد

1. شغّل `setup.sql` في Supabase SQL Editor
2. أنشئ مستخدم من Supabase Dashboard → Authentication → Users → Add User
3. ارفع الملفات (GitHub Pages أو أي استضافة)

## Supabase

يستخدم مشروع Omar: `hwzpjxxfdqsjymxbjokv` (انتقل له في 2026-10 بعد ما انحذف المشروع القديم `jbgvypuckdqzkkxgvsgb`)

الدخول للوحة لـ `omarthamen@gmail.com` و `adobea479@gmail.com` فقط (الدالة `is_hiring_admin()` في RLS).
- `hiring_settings` — فيديو الصفحة (`hero_video`)
- Storage bucket: `hiring-videos`

الجدول: `editor_applications`
- أي زائر يقدر يرسل طلب
- المستخدمين المسجلين فقط يشوفون/يعدّلون الطلبات
