import nodemailer from 'nodemailer';

// Create transporter (gunakan Gmail atau SMTP lain)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: import.meta.env.EMAIL_USER,
    pass: import.meta.env.EMAIL_PASSWORD
  }
});

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(email: string, name: string, code: string) {
  const mailOptions = {
    from: '"Animedia" <noreply@animedia.com>',
    to: email,
    subject: 'Verifikasi Email Anda - Animedia',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px dashed #2563eb; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Animedia</h1>
            <p>Portal Berita Teknologi & Pop Culture</p>
          </div>
          <div class="content">
            <h2>Halo, ${name}! 👋</h2>
            <p>Terima kasih telah mendaftar di Animedia. Untuk menyelesaikan pendaftaran, silakan verifikasi email Anda dengan memasukkan kode berikut:</p>
            
            <div class="code">${code}</div>
            
            <p><strong>Kode verifikasi ini berlaku selama 15 menit.</strong></p>
            
            <p>Jika Anda tidak mendaftar di Animedia, abaikan email ini.</p>
            
            <p>Salam hangat,<br><strong>Tim Animedia</strong></p>
          </div>
          <div class="footer">
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
            <p>&copy; 2026 Animedia. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: '"Animedia" <noreply@animedia.com>',
    to: email,
    subject: 'Selamat Datang di Animedia! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat Datang!</h1>
          </div>
          <div class="content">
            <h2>Halo, ${name}!</h2>
            <p>Akun Anda telah berhasil diverifikasi. Selamat datang di komunitas Animedia!</p>
            
            <p>Sekarang Anda dapat:</p>
            <ul>
              <li>✅ Membaca artikel tanpa batas</li>
              <li>✅ Berkomentar di artikel</li>
              <li>✅ Berlangganan newsletter</li>
              <li>✅ Menyimpan artikel favorit</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://animedia.web.id" class="button">Mulai Membaca</a>
            </div>
            
            <p>Terima kasih telah bergabung dengan kami!</p>
            
            <p>Salam hangat,<br><strong>Tim Animedia</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Animedia. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Send welcome email error:', error);
    return false;
  }
}
