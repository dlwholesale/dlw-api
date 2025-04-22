const express = require("express");
const router = express.Router();
const PlaidController = require("../controllers/plaid.controller");

router.get("/:id/link/token/create-and-send", (req, res, next) => PlaidController.createAndSendLinkToken(req, res, next));
router.get("/all/balance/get", (req, res, next) => PlaidController.getAllCustomersBalance(req, res, next));
router.get("/:id/balance/get", (req, res, next) => PlaidController.getCustomerBalance(req, res, next));
router.get("/:id/identity/get", (req, res, next) => PlaidController.getCustomerIdentity(req, res, next));

module.exports = router;
