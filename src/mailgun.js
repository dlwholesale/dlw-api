const mailgun = require("mailgun-js");

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

/**
 * Sends an email using Mailgun.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text content.
 * @param {string} [options.html] - HTML content (optional).
 */
function sendEmail({ to, subject, text, html }) {
    const data = {
        from: process.env.EMAIL_FROM,
        to, // Recipient email
        subject,
        text,
        html,
    };

    return new Promise((resolve, reject) => {
        mg.messages().send(data, function (error, body) {
            if (error) {
                console.error("Error sending email via Mailgun:", error);
                return reject(error);
            } else {
                console.log("Email sent successfully via Mailgun:", body);
                return resolve(body);
            }
        });
    });
}

module.exports = { sendEmail };
