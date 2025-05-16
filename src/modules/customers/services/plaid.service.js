const {AppDataSource} = require("../../../data-source");
const {PlaidClient} = require("../../../plaid");
const CustomerService = require("./customer.service");
const CustomerBalanceService = require("./customer-balance.service");
const PlaidDataService = require("./plaid-data.service");

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
                    postal_code: customer.postalCode,
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
                url_lifetime_seconds: 604800,
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
            const balances = await CustomerBalanceService.findByCustomer(id);
            return {
                customer,
                balances,
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
            const accounts = response.data.accounts;

            // Store per-account balances
            const storedBalances = await CustomerBalanceService.storeBalances(id, accounts);

            // Update aggregate on Customer row
            const aggregate = accounts
                .map(a => a.balances.available ?? 0)
                .reduce((sum, val) => sum + val, 0);

            const updatedCustomer = await CustomerService.updateCustomer(id, {
                balance: aggregate,
                updatedAt: now,
            });

            return {
                customer: updatedCustomer,
                balances: storedBalances,
                refreshed: true,
                message: "Fresh balance retrieved from Plaid API."
            };
        } catch (err) {
            // On error, return existing customer + any cached balances
            const balances = await CustomerBalanceService.findByCustomer(id);
            return {
                customer,
                balances,
                refreshed: false,
                message: err.message
            };
        }
    }

    async getAllLinkedCustomers() {
        return await this.customerRepository.findBy({linked: true});
    }

    async getCustomerIdentity(id) {
        const customer = await this.customerRepository.findOneBy({id: id});
        if (!customer) {
            throw new Error("Customer not found");
        }

        const request = {
            access_token: customer.accessToken
        }

        try {
            const { data } = await PlaidClient.identityGet(request);
            const accounts = data.accounts;

            const owner = accounts[0].owners[0];
            const email = owner.emails.find(data => data.primary) || owner.emails[0] || {};
            const phone = owner.phone_numbers.find(data => data.primary) || owner.phone_numbers[0] || {};
            const address = owner.addresses.find(data => data.primary) || owner.addresses[0] || {};

            return {
                customerId: id,
                name: owner.names?.[0] || null,
                email: email.data ?? null,
                phone: phone.data ?? null,
                street: address.data?.street ?? null,
                // street2: address.data?.street2 ?? null,
                city: address.data?.city ?? null,
                region: address.data?.region ?? null,
                postalCode: address.data?.postal_code ?? null,
                country: address.data?.country ?? null,
            };
        } catch (err) {
            return {
                message: err.message
            };
        }
    }

    async getCustomerAuth(id) {
        const customer = await this.customerRepository.findOneBy({id: id});
        if (!customer) {
            throw new Error("Customer not found");
        }

        const request = {
            access_token: customer.accessToken
        }

        try {
            const { data } = await PlaidClient.authGet(request);
            const achNumbers = data.numbers?.ach ?? [];

            return achNumbers.map(item => ({
                account: item.account,
                routing: item.routing,
                accountId: item.account_id
            }));
        } catch (err) {
            return {
                message: err.message
            };
        }
    }
}

module.exports = new PlaidService();
