const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

router.get("/", (req, res, next) => employeeController.getEmployees(req, res, next));

router.get("/:id", (req, res, next) => employeeController.getEmployee(req, res, next));

router.post("/", (req, res, next) => employeeController.createEmployee(req, res, next));

router.put("/:id", (req, res, next) => employeeController.updateEmployee(req, res, next));

router.delete("/:id", (req, res, next) => employeeController.deleteEmployee(req, res, next));

module.exports = router;
