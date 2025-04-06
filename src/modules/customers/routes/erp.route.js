const express = require("express");
const router = express.Router();
const ErpController = require("../controllers/erp.controller");

router.get("/customers-balances", (req, res, next) => ErpController.getCustomersBalances(req, res, next));

module.exports = router;
