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
exports.MaintenanceService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createMaintenanceIntoDb = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const tenant = yield prisma_1.default.tenant.findFirst({
        where: { userId },
    });
    if (!tenant) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Tenant not found");
    }
    const property = yield prisma_1.default.property.findFirst({
        where: { id: payload.propertyId },
    });
    if (!property) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Property not found");
    }
    const date = new Date(payload.date).toISOString();
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // upload image
        let image = "";
        if (imageFile) {
            image = (yield fileUploader_1.fileUploader.uploadToCloudinary(imageFile)).Location;
        }
        //create user profile
        const createMaintenance = yield prisma.maintenance.create({
            data: Object.assign(Object.assign({}, payload), { image, tenantId: tenant.id, date }),
        });
        return createMaintenance;
    }));
    return result;
});
const getMaintenancesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.maintenance.findMany();
    return result;
});
const getSingleMaintenances = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.maintenance.findFirst({
        where: { id },
    });
    return result;
});
const markComleted = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const maintenance = yield prisma_1.default.maintenance.findFirst({
        where: { id },
    });
    if (!maintenance) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Maintenance not found");
    }
    const property = yield prisma_1.default.property.findFirst({
        where: { id: maintenance.propertyId },
    });
    if (!property) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Property not found");
    }
    // Check if user is landlord
    const landlord = yield prisma_1.default.landlord.findFirst({
        where: { userId },
    });
    // Check if user is agency
    const agency = yield prisma_1.default.agency.findFirst({
        where: { userId },
    });
    // Validate ownership
    const isOwner = (landlord && property.landlordId === landlord.id) ||
        (agency && property.agencyId === agency.id);
    if (!isOwner) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access. You are not the owner of this property maintenance");
    }
    const result = yield prisma_1.default.maintenance.update({
        where: { id },
        data: { isCompleted: true },
    });
    return result;
});
exports.MaintenanceService = {
    createMaintenanceIntoDb,
    getMaintenancesFromDb,
    getSingleMaintenances,
    markComleted,
};
