"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const maintenance_service_1 = require("./maintenance.service");
const createMaintenance = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield maintenance_service_1.MaintenanceService.createMaintenanceIntoDb(req.body, req.file, id);
    (0, sendResponse_1.default)(res, {
        message: "Maintenance Created successfully!",
        data: result,
    });
}));
const getMaintenances = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenance_service_1.MaintenanceService.getMaintenancesFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Maintenances retrieved successfully!",
        data: result,
    });
}));
const getSingleMaintenances = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenance_service_1.MaintenanceService.getSingleMaintenances(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Maintenances retrieved successfully!",
        data: result,
    });
}));
const markComleted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenance_service_1.MaintenanceService.markComleted(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Maintenances updated successfully!",
        data: result,
    });
}));
exports.MaintenanceController = {
    createMaintenance,
    getMaintenances,
    getSingleMaintenances,
    markComleted
};
