const express = require("express");
const router = express.Router();
const WebhookController = require("../controllers/webhook.controller");

router.post("/", (req, res, next) => WebhookController.webhook(req, res, next));

module.exports = router;
