import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailAlert = async (toEmail, subject, message) => {
    try {
        const msg = {
            to: toEmail,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: subject,
            text: message,
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">TailorTech Update</h2>
                    <p style="font-size: 16px; color: #333;">${message}</p>
                    <p style="font-size: 12px; color: #888; margin-top: 30px;">Thank you for using BD Tech Tailoring Platform!</p>
                   </div>`,
        };

        await sgMail.send(msg);
        console.log(`✅ Email successfully sent to ${toEmail}`);
    } catch (error) {
        console.error("❌ SendGrid Email Error:", error.response ? error.response.body : error);
    }
};