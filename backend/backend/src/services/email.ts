import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@healthcare.com',
      to: email,
      subject: 'Code de vérification - Healthcare App',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Code de vérification</h2>
          <p>Votre code de vérification est :</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>Ce code expire dans 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
      `,
    });
    console.log(`✅ Email envoyé à ${email}`);
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Échec d\'envoi de l\'email');
  }
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@healthcare.com',
      to: email,
      subject: 'Réinitialisation de mot de passe - Healthcare App',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Votre code de réinitialisation est :</p>
          <h1 style="color: #FF5722; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>Ce code expire dans 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    });
    console.log(`✅ Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Échec d\'envoi de l\'email');
  }
}