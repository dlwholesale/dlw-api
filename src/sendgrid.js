const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text content.
 * @param {string} html - HTML content.
 */
async function sendEmail({ to, subject, text, html }) {
    const msg = {
        to,
        from: process.env.EMAIL_FROM,
        subject,
        text,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
}

module.exports = { sendEmail };
