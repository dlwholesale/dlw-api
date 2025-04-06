const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient's email.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text body.
 * @param {string} html - HTML body.
 * @returns {Promise<void>}
 */
async function sendEmail({to, subject, text, html}) {
    try {
        const mailOptions = {
            from: `"Your App Name" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {sendEmail};
