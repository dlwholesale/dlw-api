const {AppDataSource} = require("../../../data-source");
const {PlaidClient} = require("../../../plaid");
const CustomerService = require("./customer.service");
const errorLogService = require("../../error-logs/services/error-log.service");

class PlaidService {
    constructor() {
        this.customerRepository = AppDataSource.getRepository("LinkedCustomer");
    }

    async createPlaidLink(id) {
        const customer = await this.customerRepository.findOneBy({id: id});
        if (!customer) {
            throw new Error("Customer not found");
        }

        const baseUrl = process.env.API_BASE_URL;
        const request = {
            client_name: 'DL Wholesale',
            user: {
                client_user_id: customer.customerId,
                phone_number: customer.phone,
                email_address: customer.email,
                address: {
                    street: customer.street,
                    street2: customer.street2,
                    city: customer.city,
                    region: customer.region,
                    postal_code: customer.postal_code,
                    country: customer.country,
                },
            },
            products: ['auth', 'identity'],
            country_codes: ['US'],
            language: 'en',
            webhook: `${baseUrl}/webhook`,
            // redirect_uri: 'https://domainname.com/oauth-page.html',
            hosted_link: {
                // delivery_method: 'email',
                // completion_redirect_uri: '',
                is_mobile_app: false,
            },
        };

        try {
            const {data} = await PlaidClient.linkTokenCreate(request);

            return {
                expiration: data.expiration,
                hostedLinkUrl: data.hosted_link_url,
                linkToken: data.link_token,
                requestId: data.request_id,
                email: customer.email
            };
        } catch (error) {
            await errorLogService.logError(error);

            throw new Error("LINK_TOKEN could not be created!");
        }
    }

    async exchangePublicToken(publicToken) {
        const request = {
            public_token: publicToken
        }

        try {
            const response = await PlaidClient.itemPublicTokenExchange(request);

            return {
                item_id: response.data.item_id,
                access_token: response.data.access_token,
            };
        } catch (error) {
            throw new Error("ACCESS_TOKEN could not be created!");
        }
    }

    async getCustomerBalance(id) {
        const customer = await this.customerRepository.findOneBy({id: id});
        if (!customer) {
            throw new Error("Customer not found");
        }

        const now = new Date();
        const lastUpdated = customer.updatedAt ? new Date(customer.updatedAt) : null;
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

        // If balance_updated_at is null or is within the last 10 minutes, use the cached balance.
        if (!lastUpdated || lastUpdated >= tenMinutesAgo) {
            return {
                customer,
                refreshed: false,
                message: "Cached value is used because it is within the configured threshold (last ten minutes).",
            };
        }

        // Otherwise, call the Plaid API to get a fresh balance.
        const request = {
            access_token: customer.accessToken
        }

        try {
            const response = await PlaidClient.accountsBalanceGet(request);
            const balances = response.data.accounts[0].balances;

            // Update the customer's data
            const updatedCustomer = await CustomerService.updateCustomer(id, {
                balance: balances.available,
                updatedAt: now
            });

            return {
                customer: updatedCustomer,
                refreshed: true,
                message: "Fresh balance retrieved from Plaid API."
            };
        } catch (err) {
            return {
                customer,
                refreshed: false,
                message: err.message
            };
        }
    }

    async getAllLinkedCustomers() {
        return await this.customerRepository.findBy({linked: true});
    }
}

module.exports = new PlaidService();
