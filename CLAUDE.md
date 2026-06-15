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

يستخدم نفس مشروع Omar: `hwzpjxxfdqsjymxbjokv`

الجدول: `editor_applications`
- أي زائر يقدر يرسل طلب
- المستخدمين المسجلين فقط يشوفون/يعدّلون الطلبات
