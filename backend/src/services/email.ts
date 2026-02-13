import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export async function sendVerificationEmail(email: string, code: string) {
    if (!process.env.MAILTRAP_USER) {
        console.log(`[MOCK EMAIL] Verification code for ${email}: ${code}`);
        return;
    }

    await transporter.sendMail({
        from: "no-reply@healthcare.com",
        to: email,
        subject: "Your verification code",
        text: `Your code is: ${code}`,
    });
}
