require('dotenv').config();

const employeeRoutes = require("./modules/employees/routes/employee.route");
const customersRoutes = require("./modules/customers/routes/customer.route");
const plaidRoutes = require("./modules/customers/routes/plaid.route");
const webhooksRoutes = require("./modules/customers/routes/webhook.route");
const erpRoutes = require("./modules/customers/routes/erp.route");
const verifyAppToken = require('./modules/core/middlewares/app-token.middleware');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',')
    : ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(null, false);
        }
    },
    allowCredentials: true,
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Welcome to the integration with the Plaid API!');
});

app.use("/employees", employeeRoutes);
app.use("/customers", customersRoutes);
app.use("/plaid", plaidRoutes);
app.use("/webhook", webhooksRoutes);
app.use("/erp", verifyAppToken, erpRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: err.message});
});

module.exports = app;
