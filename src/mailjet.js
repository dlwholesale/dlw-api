const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY,
);

/**
 * Sends an email using Mailjet.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient's email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text content.
 * @param {string} options.html - HTML content.
 */
async function sendEmail({to, subject, text, html}) {
    try {
        const request = await mailjet
            .post("send", {version: 'v3.1'})
            .request({
                Messages: [
                    {
                        From: {
                            Email: process.env.EMAIL_FROM,
                            Name: process.env.EMAIL_FROM_NAME || "Your Company"
                        },
                        To: [
                            {
                                Email: to,
                            }
                        ],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            });
        console.log("Email sent successfully via Mailjet:", request.body);
        return request.body;
    } catch (error) {
        console.error("Error sending email via Mailjet:", error);
        throw error;
    }
}

module.exports = {sendEmail};
