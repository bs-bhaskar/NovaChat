
const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
});

const sendOtpToEmail = async (email, otp) => {
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #075e54;">🔐 NovaChat Verification</h2>
        <p>Hi there,</p>
        <p>Your one-time password (OTP) to verify your NovaChat account is:</p>
        <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
        </h1>
        <p><strong>This OTP is valid for 5 minutes.</strong> Please do not share it with anyone.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p>Thanks & Regards,<br/>NovaChat Web Security Team</p>
        <hr />
        <small>This is an automated message. Please do not reply.</small>
    </div>`;

    const message = [
        `From: NovaChat Web <${process.env.EMAIL_USER}>`,
        `To: ${email}`,
        'Subject: Your NovaChat Verification',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        html
    ].join('\r\n');

    const raw = Buffer.from(message).toString('base64url');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw }
    });

    console.log(`OTP email sent successfully to ${email}`);
};

module.exports = sendOtpToEmail;
