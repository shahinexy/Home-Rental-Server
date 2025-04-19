"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const property_validation_1 = require("./property.validation");
const property_controller_1 = require("./property.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserType.Agency, client_1.UserType.Landlord, client_1.UserType.Tenant, client_1.UserType.User), property_controller_1.PropertyController.getPropertys)
    .post((0, auth_1.default)(client_1.UserType.Landlord, client_1.UserType.Agency), (0, validateRequest_1.default)(property_validation_1.PropertyValidation.CreatePropertyValidationSchema), property_controller_1.PropertyController.createProperty);
router.get("/my-properties", (0, auth_1.default)(client_1.UserType.Landlord, client_1.UserType.Agency), property_controller_1.PropertyController.getMyProperty);
router.get("/:id", (0, auth_1.default)(client_1.UserType.Agency, client_1.UserType.Landlord, client_1.UserType.Tenant), property_controller_1.PropertyController.getSingleProperty);
exports.PropertyRoutes = router;
