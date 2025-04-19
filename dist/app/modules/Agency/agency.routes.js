"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const agency_validation_1 = require("./agency.validation");
const agency_controller_1 = require("./agency.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(client_1.UserType.User), (0, validateRequest_1.default)(agency_validation_1.AgencyValidation.CreateAgencyValidationSchema), agency_controller_1.AgencyController.createAgency);
router.get("/", agency_controller_1.AgencyController.getAgencys);
exports.AgencyRoutes = router;
