"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const maintenance_validation_1 = require("./maintenance.validation");
const maintenance_controller_1 = require("./maintenance.controller");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router
    .route("/")
    .get(maintenance_controller_1.MaintenanceController.getMaintenances)
    .post((0, auth_1.default)(client_1.UserType.Tenant), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(maintenance_validation_1.MaintenanceValidation.CreateMaintenanceValidationSchema), maintenance_controller_1.MaintenanceController.createMaintenance);
router
    .route("/:id")
    .get(maintenance_controller_1.MaintenanceController.getSingleMaintenances)
    .patch((0, auth_1.default)(client_1.UserType.Agency, client_1.UserType.Landlord), maintenance_controller_1.MaintenanceController.markComleted);
exports.MaintenanceRoutes = router;
