"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const agency_routes_1 = require("../modules/Agency/agency.routes");
const landlord_routes_1 = require("../modules/Landlord/landlord.routes");
const tenant_routes_1 = require("../modules/Tenant/tenant.routes");
const property_routes_1 = require("../modules/Property/property.routes");
const contract_routes_1 = require("../modules/Contract/contract.routes");
const maintenance_routes_1 = require("../modules/Maintenance/maintenance.routes");
const expense_routes_1 = require("../modules/Expense/expense.routes");
const finance_routes_1 = require("../modules/Finance/finance.routes");
const document_routes_1 = require("../modules/Document/document.routes");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/agency",
        route: agency_routes_1.AgencyRoutes,
    },
    {
        path: "/landlord",
        route: landlord_routes_1.LandlordRoutes,
    },
    {
        path: "/tenant",
        route: tenant_routes_1.TenantRoutes,
    },
    {
        path: "/properties",
        route: property_routes_1.PropertyRoutes,
    },
    {
        path: "/contract",
        route: contract_routes_1.ContractRoutes,
    },
    {
        path: "/expense",
        route: expense_routes_1.ExpenseRoutes,
    },
    {
        path: "/maintenance",
        route: maintenance_routes_1.MaintenanceRoutes,
    },
    {
        path: "/finance",
        route: finance_routes_1.FinanceRoutes,
    },
    {
        path: "/document",
        route: document_routes_1.DocumentRoutes,
    },
    {
        path: "/payment-details",
        route: payment_routes_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
