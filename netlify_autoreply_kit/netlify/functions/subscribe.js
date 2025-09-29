const https = require('https');

export async function handler(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { 
        statusCode: 405, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Method Not Allowed' }) 
      };
    }
    
    const { name, email, type } = JSON.parse(event.body || '{}');
    if (!email) {
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ต้องกรอกอีเมล' }) 
      };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'BIZ IDEA <noreply@yourdomain.com>';
    const SITE_URL = process.env.SITE_URL || 'https://idea2cash.netlify.app';
    const EBOOK_URL = process.env.EBOOK_URL || 'https://drive.google.com/file/d/1_JS1FIR87aHSgtOHROH384eYzDgeBbYh/view?usp=sharing';
    const WORKSHOP_URL = process.env.WORKSHOP_URL || `${SITE_URL}/workshop.html#pricing`;
    const OWNER_EMAIL = process.env.OWNER_EMAIL || '';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found');
      return { 
        statusCode: 500, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Server configuration error' }) 
      };
    }

    // Determine email content based on type
    const isEbook = type === 'ebook';
    
    let subject, htmlContent, successMessage;
    
    if (isEbook) {
      subject = 'eBook ฟรี: Idea→Cash Sprint - ดาวน์โหลดได้เลย!';
      htmlContent = `
        <p>สวัสดีคุณ ${name || 'เพื่อน BIZ IDEA'},</p>
        <p>ขอบคุณที่สนใจ eBook "Idea→Cash Sprint" ครับ</p>
        <p><strong>🎉 ดาวน์โหลด eBook ฟรีได้เลยที่นี่:</strong></p>
        <p><a href="${EBOOK_URL}" style="background: linear-gradient(135deg,#FF6B35 0%,#F7931E 100%); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">📚 ดาวน์โหลด eBook ฟรี</a></p>
        <p><strong>🎁 โบนัส: Starter Kit ฟรี!</strong></p>
        <p><a href="https://docs.google.com/spreadsheets/d/1vg7N9SZSYdP8ZRai1XeIXC4EcGdt-9zH/edit?usp=sharing&ouid=118248382152291538899&rtpof=true&sd=true" style="background: linear-gradient(135deg,#28a745 0%,#20c997 100%); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">📊 ดาวน์โหลด Starter Kit</a></p>
        <p>📖 <strong>สิ่งที่คุณจะได้เรียนใน ebook นี้:</strong></p>
        <ul>
          <li>🚀 Quick Start 24 ชม. - เริ่มจากศูนย์ให้ได้เงินเร็วที่สุด</li>
          <li>📊 RICE Framework + MVP Library - วิธีให้คะแนนไอเดีย</li>
          <li>💰 Offer 3 แพ็ก - สูตรข้อความขาย + การตั้งราคา</li>
          <li>📈 Tracking ง่าย - วิธีติดตาม Conversion, CAC</li>
          <li>🎯 เทมเพลตครบชุด - แบบฟอร์มและเครื่องมือที่จำเป็น</li>
          <li>📚 เคสสตัดี 10 เคส - ตัวอย่างจริงจากผู้ประกอบการ</li>
        </ul>
        <p>หากสนใจเรียนแบบสดและได้คำแนะนำเพิ่มเติม สามารถดู Workshop ได้ที่: <a href="${WORKSHOP_URL}">Workshop Idea→Cash Sprint</a></p>
        <p>ขอให้ประสบความสำเร็จกับการเปลี่ยนไอเดียเป็นเงินครับ!</p>
        <p>รณยศ<br>BIZ IDEA<br><a href="${SITE_URL}">${SITE_URL}</a></p>
      `;
      successMessage = 'ส่งลิงก์ eBook ไปที่อีเมลแล้ว';
    } else {
      subject = 'ยืนยันที่นั่ง Workshop ต.ค. 2025';
      htmlContent = `
        <p>สวัสดีคุณ ${name || 'เพื่อน BIZ IDEA'},</p>
        <p>ขอบคุณที่สนใจ Workshop "Idea→Cash Sprint" เดือนตุลาคม 2025 นะครับ</p>
        <p><strong>กำหนดการ Workshop สด:</strong> เลือกเรียนได้ 1 วัน<br>
        เสาร์ 11, อาทิตย์ 12, เสาร์ 18, อาทิตย์ 19, เสาร์ 25, อาทิตย์ 26 ต.ค. 2025<br>
        เวลา 10:00–17:00 น. (GMT+7) | ผ่าน Zoom</p>
        <p>นี่คือขั้นตอนต่อไป:</p>
        <ol>
          <li><strong>ชำระเงิน:</strong> โอนเงินมาที่บัญชี <strong>BBL 1384416804 (รณยศ ตันติถาวรรัช)</strong> ตามแพ็กเกจที่คุณเลือก</li>
          <li><strong>ยืนยันการชำระเงิน:</strong> แนบสลิปและแจ้งข้อมูลที่ <a href="https://docs.google.com/forms/d/e/1FAIpQLSdkYo6AaBnYVdrZb_WxfPDkX0UcX2NdJPW1LpF6Hd2qaeqd5A/viewform?usp=header">Google Form นี้</a></li>
        </ol>
        <p>หลังจากทีมงานตรวจสอบแล้ว จะส่งลิงก์ Zoom และรายละเอียดการเตรียมตัวให้ทางอีเมลภายใน 24 ชั่วโมงครับ</p>
        <p>เจอกันในคลาสครับ!</p>
        <p>รณยศ<br>BIZ IDEA<br><a href="${SITE_URL}">${SITE_URL}</a></p>
      `;
      successMessage = 'ส่งข้อมูลการยืนยันที่นั่งไปที่อีเมลแล้ว';
    }

    // Use node-fetch or built-in fetch for Node 18+
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${RESEND_API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: subject,
        html: htmlContent
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend API error:', res.status, errorText);
      return { 
        statusCode: 502, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ส่งอีเมลไม่สำเร็จ' }) 
      };
    }

    // Send notification to owner
    if (OWNER_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${RESEND_API_KEY}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [OWNER_EMAIL],
            subject: isEbook ? 'New eBook lead' : 'New Workshop lead',
            text: `Type: ${isEbook ? 'eBook' : 'Workshop'}\nName: ${name || ''}\nEmail: ${email}`
          })
        });
      } catch (e) {
        console.error('Owner notification error:', e);
      }
    }

    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: successMessage }) 
    };
  } catch (err) {
    console.error('Function error:', err);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'เกิดข้อผิดพลาด' }) 
    };
  }
}