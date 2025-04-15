const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    basePath: process.env.NODE_ENV === 'development' ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const PlaidClient = new PlaidApi(configuration);

module.exports = { PlaidClient };
