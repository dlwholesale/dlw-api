const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: process.env.SMTP_REQUIRE_TLS === 'true',
    auth: {
        user: process.env.SMTP_USER,
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
            from: `"DL Wholesale" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
}

module.exports = {sendEmail};
