const CustomerService = require("../services/customer.service");
const PlaidService = require("../services/plaid.service");

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
        try {
            const customer = await CustomerService.findCustomerByLinkToken(linkToken);

            const accessToken = await this.getAccessToken(publicTokens[0]);

            await CustomerService.updateCustomer(customer.id, {
                linkToken: null,
                accessToken: accessToken,
                linked: accessToken !== null,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.log('An error has occurred!', error);
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
