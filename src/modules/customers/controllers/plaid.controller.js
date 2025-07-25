const PlaidService = require("../services/plaid.service");
const CustomerService = require("../services/customer.service");
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
        const id = parseInt(req.params.id, 10);

        try {
            const customer = await PlaidService.getCustomerBalance(id);

            return res.json(customer);
        } catch (err) {
            if (err.message === 'ITEM_LOGIN_REQUIRED') {
                await this.newLinkInUpdateMode(id);

                return res.status(401).json({error: 'Customer\'s login expired. A new Plaid Link was sent to re-authenticate.'});
            }

            return res.status(err.response?.status ?? 500).json({error: err.message});
        }
    }

    async getCustomerIdentity(req, res, next) {
        const id = parseInt(req.params.id, 10);

        try {
            const data = await PlaidService.getCustomerIdentity(id);

            return res.json(data);
        } catch (err) {
            if (err.message === 'ITEM_LOGIN_REQUIRED') {
                await this.newLinkInUpdateMode(id);

                return res.status(401).json({error: 'Customer\'s login expired. A new Plaid Link was sent to re-authenticate.'});
            }

            return res.status(err.response?.status ?? 500).json({error: err.message});
        }
    }

    async getCustomerAuth(req, res, next) {
        const id = parseInt(req.params.id, 10);

        try {
            const data = await PlaidService.getCustomerAuth(id);

            return res.json(data);
        } catch (err) {
            if (err.message === 'ITEM_LOGIN_REQUIRED') {
                await this.newLinkInUpdateMode(id);

                return res.status(401).json({error: 'Customer\'s login expired. A new Plaid Link was sent to re-authenticate.'});
            }

            return res.status(err.response?.status ?? 500).json({error: err.message});
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

    async emailHostedLinkUrlToCustomer(hostedLinkUrl, email, updateMode = false) {
        const subject = [
            "Link your account to continue making ACH Payments",
            "Please reconnect your bank account to continue making ACH Payments",
        ];
        const text = [
            `
Dear Customer,

In order to make payments to DL Wholesale Inc, please click the link below to set up your Plaid link:

${hostedLinkUrl}

The above link expires in 7 days. If it has expired, please contact your DLW sales representative for a new one.

Regards,  
DLW Accounting Team 
`,
            `
Dear Customer,

Your bank session has expired. In order to continue making payments to DL Wholesale Inc, please click the link below to 
reconnect your account:

${hostedLinkUrl}

The above link expires in 7 days. If it has expired, please contact your DLW sales representative for a new one.

Regards,  
DLW Accounting Team
`,
        ];
        const html = [
            `
  <p>Dear Customer,</p>
  <p>In order to make payments to DL Wholesale Inc, please click the link below to set up your Plaid link.</p>
  <p><a href="${hostedLinkUrl}">${hostedLinkUrl}</a></p>
  <p>The above link expires in 7 days. If it has expired, please contact your DLW sales representative for a new one.</p>
  <p>Regards,<br>DLW Accounting Team</p>
`,
            `
  <p>Dear Customer,</p>
  <p>Your bank session has expired. In order to continue making payments to DL Wholesale Inc, please click the link below to reconnect your account.</p>
  <p><a href="${hostedLinkUrl}">${hostedLinkUrl}</a></p>
  <p>The above link expires in 7 days. If it has expired, please contact your DLW sales representative for a new one.</p>
  <p>Regards,<br>DLW Accounting Team</p>
`,
        ];

        const index = updateMode ? 1 : 0;
        await sendEmail({
            to: email,
            subject: subject[index],
            text: text[index],
            html: html[index]
        });
    }

    async newLinkInUpdateMode(id) {
        const customer = await CustomerService.getCustomer(id);

        if (!customer.linked) return;

        const {
            hostedLinkUrl,
            linkToken,
            requestId,
            email
        } = await PlaidService.createPlaidLink(customer.id, customer.accessToken);

        await CustomerService.updateCustomer(customer.id, {linkToken, linked: false, updateMode: true});

        await this.emailHostedLinkUrlToCustomer(hostedLinkUrl, email, true);
    }
}

module.exports = new PlaidController();
