const {AppDataSource} = require("../../../data-source");

class CustomerBalanceService {
    constructor() {
        this.customerBalanceRepository = AppDataSource.getRepository("CustomerBalance");
    }

    async findByCustomer(customerId) {
        return await this.customerBalanceRepository.find({
            where: { customer: { id: customerId } },
        });
    }

    async storeBalances(customerId, accounts) {
        await this.customerBalanceRepository.delete({ customer: { id: customerId } });

        const toSave = accounts.map((acc) =>
            this.customerBalanceRepository.create({
                customer: { id: customerId },
                accountId: acc.account_id,
                accountName: acc.name,
                accountType: acc.type,
                availableBalance: acc.balances.available,
            })
        );

        return await this.customerBalanceRepository.save(toSave);
    }
}

module.exports = new CustomerBalanceService();
