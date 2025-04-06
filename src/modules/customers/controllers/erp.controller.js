const PlaidService = require("../services/plaid.service");

class ErpController {
    async getCustomersBalances(req, res, next) {
        try {
            const linkedCustomers = await PlaidService.getAllLinkedCustomers();

            const balancePromises = linkedCustomers.map(customer =>
                PlaidService.getCustomerBalance(customer.id)
            );

            const balanceResults = await Promise.allSettled(balancePromises);

            const data = balanceResults
                .filter(result => result.status === 'fulfilled')
                .map(result => ({id: result.value.customer.customerId, balance: result.value.customer.balance}));

            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new ErpController();
