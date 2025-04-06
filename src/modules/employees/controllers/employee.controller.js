const employeeService = require("../services/employee.service");

class EmployeeController {
    async getEmployees(req, res, next) {
        try {
            const employees = await employeeService.getEmployees();
            return res.json(employees);
        } catch (err) {
            next(err);
        }
    }

    async getEmployee(req, res, next) {
        try {
            const id = req.params.id;
            const employee = await employeeService.getEmployee(id);
            return res.json(employee);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async createEmployee(req, res, next) {
        try {
            const employee = await employeeService.createEmployee(req.body);
            return res.status(201).json(employee);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async updateEmployee(req, res, next) {
        try {
            const id = req.params.id;
            const employee = await employeeService.updateEmployee(id, req.body);
            return res.json(employee);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async deleteEmployee(req, res, next) {
        try {
            const id = req.params.id;
            const success = await employeeService.deleteEmployee(id);
            return res.json(success);
        } catch (err) {
            return res.status(400).json({error: err.message});
        }
    }
}

module.exports = new EmployeeController();
