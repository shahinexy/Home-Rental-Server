"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const finance_controller_1 = require("./finance.controller");
const router = express_1.default.Router();
router.get("/", finance_controller_1.FinanceController.getFinance);
exports.FinanceRoutes = router;
