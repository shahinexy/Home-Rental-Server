"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const contract_validation_1 = require("./contract.validation");
const contract_controller_1 = require("./contract.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserType.Agency, client_1.UserType.Landlord, client_1.UserType.Tenant, client_1.UserType.User), contract_controller_1.ContractControllers.getContracts)
    .post((0, auth_1.default)(client_1.UserType.Landlord, client_1.UserType.Agency), (0, validateRequest_1.default)(contract_validation_1.ContractValidation.CreateContractValidationSchema), contract_controller_1.ContractControllers.createContract);
router.get("/my-contract", (0, auth_1.default)(client_1.UserType.Tenant, client_1.UserType.Agency), contract_controller_1.ContractControllers.getMyContracts);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserType.Agency, client_1.UserType.Landlord, client_1.UserType.Tenant, client_1.UserType.User), contract_controller_1.ContractControllers.getSingleContract)
    .delete((0, auth_1.default)(client_1.UserType.Landlord, client_1.UserType.Agency), contract_controller_1.ContractControllers.deleteContract);
exports.ContractRoutes = router;
