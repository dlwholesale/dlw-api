const CustomerService = require("../services/customer.service");
const PlaidService = require("../services/plaid.service");
const PlaidDataService = require("../services/plaid-data.service");
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
                    await this.sessionFinished(linkToken, status, publicTokens);

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
            console.log('An error has occurred!', error);
            throw new Error(error.message);
        }

        // Get customer's info from Plaid
        if (customer) {
            const baseUrl = process.env.API_BASE_URL;

            try {
                const data = await axios.get(`${baseUrl}/plaid/${customer.id}/identity/get`);

                return await PlaidDataService.upsertPlaidDataForCustomer(customer.id, data);
            } catch (error) {
                console.log('An error has occurred!', error);
                throw new Error(error.message);
            }
        }
    }

    async getAccessToken(token) {
        try {
            const response = await PlaidService.exchangePublicToken(token);

            return response.access_token ?? null;
        } catch (error) {
            // Do nothing
            return null;
        }
    }
}

module.exports = new WebhookController();
