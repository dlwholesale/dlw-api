const PlaidService = require("../services/plaid.service");
// const { sendEmail } = require("../../../sendgrid");
// const { sendEmail } = require("../../../mailjet");
const {sendEmail} = require("../../../nodemailer");

class PlaidController {
    async getAllCustomersBalance(req, res, next) {
        try {
            const linkedCustomers = await PlaidService.getAllLinkedCustomers();

            const balancePromises = linkedCustomers.map(customer =>
                PlaidService.getCustomerBalance(customer.id)
            );

            const balanceResults = await Promise.allSettled(balancePromises);

            const updatedCustomers = balanceResults
                .filter(result => result.status === 'fulfilled' && result.value.refreshed)
                .map(result => result.value.customer);

            return res.json({
                linked: linkedCustomers.length,
                refreshed: updatedCustomers.length,
                customers: updatedCustomers,
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getCustomerBalance(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const customer = await PlaidService.getCustomerBalance(id);

            return res.json(customer);
        } catch (err) {
            return res.status(404).json({error: err.message});
        }
    }

    async createAndSendLinkToken(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const {hostedLinkUrl, linkToken, requestId, email} = await PlaidService.createPlaidLink(id);

            await this.emailHostedLinkUrlToCustomer(hostedLinkUrl, email);

            return res.json({
                linkToken,
                requestId
            });
        } catch (error) {
            return res.status(500).json({error: {message: `Invalid login: ${error.response}`}});
        }
    }

    async emailHostedLinkUrlToCustomer(hostedLinkUrl, email) {
        const subject = "Plaid Hosted Link session";
        const text = `Hello,\n\nTo link your account, visit: ${hostedLinkUrl}\n\nRegards,\nDL Wholesales`;
        const html = `<p>Hello,</p>
                    <p>To link your account, visit: <a href="${hostedLinkUrl}">${hostedLinkUrl}</a></p>
                    <p>Regards,<br>DL Wholesale</p>`;

        await sendEmail({to: email, subject, text, html});
    }
}

module.exports = new PlaidController();
