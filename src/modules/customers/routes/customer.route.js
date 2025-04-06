const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");

router.get("/", (req, res, next) => CustomerController.getCustomers(req, res, next));
router.get("/:id", (req, res, next) => CustomerController.getCustomer(req, res, next));
router.post("/", (req, res, next) => CustomerController.createCustomer(req, res, next));
router.put("/:id", (req, res, next) => CustomerController.updateCustomer(req, res, next));
router.delete("/:id", (req, res, next) => CustomerController.deleteCustomer(req, res, next));
router.get("/:id/link/token/create-and-send", (req, res, next) => CustomerController.createAndSendHostedLink(req, res, next));

module.exports = router;
