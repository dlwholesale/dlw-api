const {AppDataSource} = require("../../../data-source");

class PlaidDataService {
    constructor() {
        this.plaidDataRepository = AppDataSource.getRepository("PlaidData");
    }

    async upsertPlaidDataForCustomer(id, data) {
        let entity;

        entity = await this.plaidDataRepository.findOneBy({customerId: id});
        if (!entity) {
            entity = this.plaidDataRepository.create(data);
        } else {
            this.plaidDataRepository.merge(entity, data);
        }

        return await this.plaidDataRepository.save(entity);
    }

    async getCustomerIdentity(id) {
        const entity = await this.plaidDataRepository.findOneBy({customerId: id});
        if (!entity) {
            throw new Error("Customer not found");
        }

        return entity;
    }
}

module.exports = new PlaidDataService();
