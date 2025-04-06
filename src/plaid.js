const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    // FIXME: sandbox or production
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const PlaidClient = new PlaidApi(configuration);

module.exports = { PlaidClient };
