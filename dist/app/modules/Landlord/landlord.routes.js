"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandlordRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const landlord_validation_1 = require("./landlord.validation");
const landlord_controller_1 = require("./landlord.controller");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(client_1.UserType.User), (0, validateRequest_1.default)(landlord_validation_1.LandlordValidation.CreateLandlordValidationSchema), landlord_controller_1.LandlordController.createLandlord);
router.get("/", landlord_controller_1.LandlordController.getLandlords);
exports.LandlordRoutes = router;
