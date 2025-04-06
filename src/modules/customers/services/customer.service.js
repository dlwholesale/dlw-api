const {AppDataSource} = require("../../../data-source");

class CustomerService {
    constructor() {
        this.customerRepository = AppDataSource.getRepository("Customer");
    }

    async getCustomers() {
        return await this.customerRepository.find();
    }

    async getCustomer(id) {
        const customer = await this.customerRepository.findOneBy({id: id});
        if (!customer) {
            throw new Error("Customer not found");
        }

        return customer;
    }

    async createCustomer(data) {
        const customer = this.customerRepository.create(data);

        return await this.customerRepository.save(customer);
    }

    async updateCustomer(id, data) {
        const customer = await this.getCustomer(id);
        this.customerRepository.merge(customer, data);

        return await this.customerRepository.save(customer);
    }

    async deleteCustomer(id) {
        await this.customerRepository.delete(id);
    }

    async findCustomerByLinkToken(linkToken) {
        const customer = await this.customerRepository.findOneBy({linkToken: linkToken});

        if (!customer) {
            throw new Error("Customer not found");
        }

        return customer;
    }
}

module.exports = new CustomerService();
