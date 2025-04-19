"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const expense_controller_1 = require("./expense.controller");
const fileUploader_1 = require("../../../helpars/fileUploader");
const expense_validation_1 = require("./expense.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(expense_controller_1.ExpenseController.getExpenses)
    .post((0, auth_1.default)(client_1.UserType.Tenant, client_1.UserType.Agency), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(expense_validation_1.ExpenseValidation.CreateExpenseValidationSchema), expense_controller_1.ExpenseController.createExpense);
router.route("/:id").get(expense_controller_1.ExpenseController.getSingleExpenses);
exports.ExpenseRoutes = router;
