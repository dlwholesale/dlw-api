const CustomerService = require("../services/customer.service");
const PlaidService = require("../services/plaid.service");
const PlaidDataService = require("../services/plaid-data.service");
const ErrorLogService = require("../../error-logs/services/error-log.service");
const {sendEmail} = require("../../../nodemailer");
const axios = require("axios");

class WebhookController {
    async webhook(req, res, next) {
        const {
            webhook_type: webhookType,
            webhook_code: webhookCode,
            status,
            link_token: linkToken,
            public_tokens: publicTokens
        } = req.body;

        if (webhookType === 'LINK') {
            switch (webhookCode) {
                case 'SESSION_FINISHED':
                    try {
                        await this.sessionFinished(linkToken, status, publicTokens);
                    } catch (error) {
                        await ErrorLogService.logError(error, {
                            url: req.url,
                            method: req.method,
                            headers: req.headers,
                            body: req.body
                        });

                        await this.emailLogNotification();
                    }

                    break;
                default:
                // Do nothing
            }
        }

        res.status(200).json({message: 'Webhook processed successfully'});
    }

    async sessionFinished(linkToken, status, publicTokens) {
        let customer;

        try {
            customer = await CustomerService.findCustomerByLinkToken(linkToken);

            const accessToken = await this.getAccessToken(publicTokens[0]);

            await CustomerService.updateCustomer(customer.id, {
                linkToken: null,
                accessToken: accessToken,
                linked: accessToken !== null,
                updatedAt: new Date(),
            });
        } catch (error) {
            await ErrorLogService.logError(error, {
                source: 'webhook',
                type: 'SESSION_FINISHED',
                action: 'Find or update customer',
                link_token: linkToken,
                status: status,
            });

            throw new Error("Customer could not be found or updated!");
        }

        // Get customer's info from Plaid
        if (customer) {
            const baseUrl = process.env.API_BASE_URL;

            try {
                const {data} = await axios.get(`${baseUrl}/plaid/${customer.id}/identity/get`);

                return await PlaidDataService.upsertPlaidDataForCustomer(customer.id, data);
            } catch (error) {
                await ErrorLogService.logError(error, {
                    source: 'webhook',
                    type: 'SESSION_FINISHED',
                    action: 'Get customer identity',
                    customer: {
                        id: customer.id,
                        customer_id: customer.customerId,
                        name: customer.name,
                        email: customer.email,
                    }
                });

                throw new Error('Could not get customer identity');
            }
        }
    }

    async getAccessToken(token) {
        try {
            const response = await PlaidService.exchangePublicToken(token);

            return response.access_token ?? null;
        } catch (error) {
            await ErrorLogService.logError(error, {
                source: 'webhook',
                type: 'SESSION_FINISHED',
                action: 'Public token exchange failed',
            });

            throw new Error('Could not exchange public token!');
        }
    }

    async emailLogNotification() {
        const email = process.env.LOG_MANAGERS_EMAILS;
        // const email = process.env.LOG_MANAGERS_EMAILS.split(",");
        const subject = "An error has been logged";
        const text = `
Unfortunately an error has occurred. Please, check the logs table for more information about it.

Regards,  
App Developer
`;
        const html = `
  <p>Unfortunately an error has occurred. Please, check the logs table for more information about it.</p>
  <p>Regards,<br>App Developer</p>
`;

        await sendEmail({to: email, subject, text, html});
    }
}

module.exports = new WebhookController();
