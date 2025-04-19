"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const tenant_validation_1 = require("./tenant.validation");
const tenant_controller_1 = require("./tenant.controller");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(client_1.UserType.User), (0, validateRequest_1.default)(tenant_validation_1.TenantValidation.CreateTenantValidationSchema), tenant_controller_1.TenantController.createTenant);
router.get("/", tenant_controller_1.TenantController.getTenants);
exports.TenantRoutes = router;
