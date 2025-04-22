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

    async getCustomerIdentity(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const data = await PlaidService.getCustomerIdentity(id);

            return res.json(data);
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
        const subject = "Link your account to continue making ACH Payments";
        const text = `Dear Customer,\n\nIn order to make payments to DL Wholesale Inc, please click the link below to setup your Plaid link.\n\n${hostedLinkUrl}\n\nRegards,\nDLW Accounting Team`;
        const html = `<p>Dear Customer,</p>
                    <p>In order to make payments to DL Wholesale Inc, please click the link below to setup your Plaid link.</p>
                    <p><a href="${hostedLinkUrl}">${hostedLinkUrl}</a></p>
                    <p>Regards,<br>DLW Accounting Team</p>`;

        await sendEmail({to: email, subject, text, html});
    }
}

module.exports = new PlaidController();
