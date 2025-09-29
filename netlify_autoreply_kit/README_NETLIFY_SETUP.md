# Netlify Autoreply Kit — idea2cash.netlify.app

## 1) วางไฟล์
- โยนโฟลเดอร์ `netlify/functions/subscribe.js` เข้า repo/โปรเจ็กต์ Netlify ของคุณ
- วาง `index_form_snippet.html` ลงในหน้า eBook (หรือคัดลอกเฉพาะ `<form>...</form>` + `<script>...</script>`)
- อัปโหลดไฟล์ eBook ไปที่ `/public/downloads/ebook_idea_to_cash_TH_v4.pdf` (หรือแก้ URL เอง)

## 2) ตั้งค่า Environment Variables (Site settings → Build & deploy → Environment)
- `RESEND_API_KEY` = API Key จาก Resend
- `FROM_EMAIL` = ชื่อผู้ส่งและอีเมลบนโดเมนที่ยืนยัน SPF/DKIM แล้ว เช่น `BIZ IDEA <noreply@yourdomain.com>`
- `SITE_URL` = `https://idea2cash.netlify.app`
- `EBOOK_URL` = `https://idea2cash.netlify.app/downloads/ebook_idea_to_cash_TH_v4.pdf` (แก้เป็นไฟล์จริงของคุณได้)
- `WORKSHOP_URL` = `https://idea2cash.netlify.app/workshop.html#pricing`
- `OWNER_EMAIL` = (ไม่บังคับ) อีเมลที่ให้แจ้งเตือนเมื่อมีลีดใหม่

> **หมายเหตุเรื่องอีเมล**: เพื่อส่งเข้า Inbox ดีขึ้น ควรใช้โดเมนของคุณเอง (ไม่ใช่ `netlify.app`) และตั้งค่า DNS ตามที่ Resend ให้มา (SPF/DKIM).

## 3) ทดสอบ
```bash
curl -X POST https://idea2cash.netlify.app/.netlify/functions/subscribe   -H "Content-Type: application/json"   -d '{"name":"ทดสอบ","email":"your@email.com"}'
```
ควรได้ `{ "message": "ส่งลิงก์ eBook ไปที่อีเมลแล้ว" }`

## 4) ปัญหาที่พบบ่อย
- 502/500: ตรวจ `RESEND_API_KEY` และโดเมนผู้ส่ง (SPF/DKIM)
- ส่งเข้ากล่อง Promotions: ลดลิงก์/ภาพ, หัวเรื่องไม่ขายเกินไป, ขอให้ผู้รับเพิ่ม contact
- ลิงก์ดาวน์โหลดเสีย: ตรวจ `EBOOK_URL` ให้ถูกต้อง (แนะนำโฟลเดอร์ `/downloads/`)
