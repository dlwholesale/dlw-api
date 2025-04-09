const CustomerService = require("../services/customer.service");
const axios = require("axios");

class CustomerController {
    async getCustomers(req, res, next) {
        try {
            const customers = await CustomerService.getCustomers();

            return res.json(customers);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    }

    async getCustomer(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const customer = await CustomerService.getCustomer(id);

            return res.json(customer);
        } catch (err) {
            return res.status(404).json({error: err.message});
        }
    }

    async createCustomer(req, res, next) {
        let customer;
        let msg1;
        try {
            customer = await CustomerService.createCustomer(req.body);

            msg1 = 'Customer created successfully.';
        } catch (err) {
            return res.status(400).json({message: err.detail});
        }

        let msg2;
        try {
            await this.createAndSendHostedLinkForCustomer(customer.id);

            msg2 = 'Email sent for account linking';
        } catch (err) {
            msg2 = err.message;
        }

        return res.status(201).json({customer, message: `${msg1}. ${msg2}`});
    }

    async updateCustomer(req, res, next) {
        let customer;
        let msg1;
        try {
            const id = parseInt(req.params.id, 10);
            customer = await CustomerService.updateCustomer(id, req.body);

            msg1 = 'Customer updated successfully.';
        } catch (err) {
            return res.status(400).json({message: err.detail});
        }

        let msg2;
        try {
            await this.createAndSendHostedLinkForCustomer(customer.id);

            msg2 = 'Email sent for account linking';
        } catch (err) {
            msg2 = err.message;
        }

        return res.status(201).json({customer, message: `${msg1}. ${msg2}`});
    }

    async deleteCustomer(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            await CustomerService.deleteCustomer(id);

            return res.status(204).send();
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    }

    async createAndSendHostedLink(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const customer = await this.createAndSendHostedLinkForCustomer(id);

            return res.status(201).json(customer);
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    }

    async createAndSendHostedLinkForCustomer(id) {
        const baseUrl = process.env.API_BASE_URL;

        try {
            const {data} = await axios.get(`${baseUrl}/plaid/${id}/link/token/create-and-send`);

            return await CustomerService.updateCustomer(id, {linkToken: data.linkToken, linked: false});
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CustomerController();
