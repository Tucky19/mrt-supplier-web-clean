# MRT Supplier - Deploy Checklist v1

## 1. Build / TypeScript
- [ ] `npm run build` ผ่าน
- [ ] ไม่มี TypeScript error
- [ ] ไม่มี Prisma schema drift

## 2. Environment
- [ ] `DATABASE_URL` ถูกต้อง
- [ ] `ADMIN_BASIC_USER` ตั้งแล้ว
- [ ] `ADMIN_BASIC_PASS` ตั้งแล้ว
- [ ] `SITE_URL` ถูกต้อง
- [ ] SMTP env ครบ ถ้าต้องส่งเมลจริง
- [ ] `RFQ_TO_EMAIL` และ `RFQ_FROM_EMAIL` ถูกต้อง

## 3. Database
- [ ] `npx prisma generate` ผ่าน
- [ ] `npx prisma db push` หรือ migrate ล่าสุดถูก apply แล้ว
- [ ] ตาราง/คอลัมน์ใหม่อยู่ครบ
- [ ] `/api/health` db check ผ่าน

## 4. Product Data
- [ ] โครงสร้างสินค้าใช้ type กลางเดียว
- [ ] `npm run check:products` ผ่าน
- [ ] ไม่มี duplicate `id`
- [ ] ไม่มี duplicate `partNo`
- [ ] URL สำคัญถูกต้อง

## 5. Public Flow
- [ ] search ใช้งานได้
- [ ] product detail ใช้งานได้
- [ ] add to quote ใช้งานได้
- [ ] submit RFQ ใช้งานได้
- [ ] บันทึก DB สำเร็จ

## 6. Admin Flow
- [ ] `/admin/rfq` เข้าได้
- [ ] basic auth ทำงาน
- [ ] list/detail โหลดได้
- [ ] status update ได้
- [ ] note ได้
- [ ] follow-up ได้
- [ ] quote record ได้
- [ ] quote document ได้
- [ ] bulk actions ได้

## 7. Email / Notification
- [ ] admin email ส่งจริง
- [ ] customer email ส่งจริง (ถ้ามีเปิดใช้งาน)
- [ ] timeline/event ไม่พังเมื่อ email success/fail

## 8. Health / Ops
- [ ] `/api/health` คืนค่า ok
- [ ] production logs อ่านได้
- [ ] error route ไม่พังทั้งระบบ

## 9. Final Smoke Test
- [ ] submit RFQ 1 รายการจริง
- [ ] เปิด admin detail ของ RFQ นั้น
- [ ] เปลี่ยน status
- [ ] เพิ่ม note
- [ ] เพิ่ม follow-up
- [ ] save quote record
- [ ] save quote document
- [ ] ดู timeline ครบ