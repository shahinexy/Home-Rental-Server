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
exports.ContractServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const contract_utils_1 = require("./contract.utils");
const createContractIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: { id: userId },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Get user profile based on user type (Landlord or Agency)
    let profileId;
    let isLandlord = false;
    let isAgency = false;
    if (isUserExits.userType === "Landlord") {
        const isLandloardExists = yield prisma_1.default.landlord.findFirst({
            where: { userId },
        });
        if (!isLandloardExists) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Setup your profile as landlord");
        }
        profileId = isLandloardExists.id;
        isLandlord = true;
    }
    else if (isUserExits.userType === "Agency") {
        const isAgencyExists = yield prisma_1.default.agency.findFirst({
            where: { userId },
        });
        if (!isAgencyExists) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Setup your profile as agency");
        }
        profileId = isAgencyExists.id;
        isAgency = true;
    }
    else {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    // Fetch the property and ensure it's created by the correct profile
    const isPropertyExists = yield prisma_1.default.property.findFirst({
        where: { id: payload.propertyId },
    });
    if (!isPropertyExists) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Property not found");
    }
    if (isLandlord && isPropertyExists.landlordId !== profileId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access for Landlord");
    }
    if (isAgency && isPropertyExists.agencyId !== profileId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access for Agency");
    }
    // Check if a contract already exists for this property
    const isContractAlreadyExists = yield prisma_1.default.contract.findFirst({
        where: { propertyId: payload.propertyId },
    });
    if (isContractAlreadyExists) {
        throw new ApiErrors_1.default(http_status_1.default.CONFLICT, "Property contract already exists");
    }
    // Create contract logic
    const hashedPassword = yield bcrypt_1.default.hash("12345678", Number(config_1.default.bcrypt_salt_rounds));
    const userData = {
        email: payload.email,
        password: hashedPassword,
    };
    const tenantData = {
        fullName: payload.tenantName,
        emiratesId: payload.emiratesID,
        email: payload.email,
        phone: payload.mobile,
        userType: client_1.UserType.Tenant,
    };
    const startDate = new Date(payload.startDate).toISOString();
    const endDate = new Date(payload.endDate).toISOString();
    // =========== Start transaction ==========
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let tenantId;
        const isTenantExists = yield prisma.tenant.findFirst({
            where: { email: payload.email },
        });
        if (!isTenantExists) {
            // Create User
            const createUser = yield prisma.user.create({
                data: userData,
            });
            if (!createUser) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Failed to create User");
            }
            // Update User
            const updateUser = yield prisma.user.update({
                where: { id: createUser.id },
                data: {
                    isProfileSetUp: true,
                    userType: client_1.UserType.Tenant,
                },
            });
            if (!updateUser) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Failed to update User");
            }
            // Create Tenant
            const createTenant = yield prisma.tenant.create({
                data: Object.assign(Object.assign({}, tenantData), { userId: createUser.id }),
            });
            if (!createTenant) {
                throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Failed to create Tenant");
            }
            tenantId = createTenant.id;
        }
        else {
            tenantId = isTenantExists.id;
        }
        // Create Contract
        const createContract = yield prisma.contract.create({
            data: Object.assign(Object.assign({}, payload), { tenantId: tenantId, startDate, endDate }),
        });
        if (!createContract) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Failed to create Contract");
        }
        // create contract payment details
        const paymentDetails = (0, contract_utils_1.generatePaymentDetails)({
            paymentsPerYear: payload.numberPayments,
            totalAmount: payload.deposit,
            startDate: payload.startDate,
        });
        const createPaymentDetails = yield prisma.payment.create({
            data: {
                paymentDetails: { create: paymentDetails },
                propertyId: payload.propertyId,
            },
        });
        // Update Property with contract expiry
        const contractExpiresAt = new Date();
        contractExpiresAt.setDate(contractExpiresAt.getDate() + 100);
        const updateProperty = yield prisma.property.update({
            where: { id: payload.propertyId },
            data: {
                isContractCreated: true,
                contractExpiresAt,
            },
        });
        return createContract;
    }));
    return result;
});
const getContractsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contract.findMany({
        include: { property: true },
    });
    return result;
});
const getMyContracts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isTenantExists = yield prisma_1.default.tenant.findFirst({
        where: { userId },
    });
    if (!isTenantExists) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Setup your profile as tenant");
    }
    const result = yield prisma_1.default.contract.findMany({
        where: { tenantId: isTenantExists.id },
        include: { property: true },
    });
    return result;
});
const getSingleContract = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contract.findFirst({
        where: { id },
        include: { property: true },
    });
    return result;
});
const deleteContract = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isContractExists = yield prisma_1.default.contract.findFirst({
        where: { id },
    });
    if (!isContractExists) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Contract not found");
    }
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const getProperty = yield prisma_1.default.property.findFirst({
        where: { id: isContractExists.propertyId },
    });
    if (!getProperty) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Property not found");
    }
    if (isUserExits.userType === "Landlord") {
        const isLandloardExists = yield prisma_1.default.landlord.findFirst({
            where: { userId },
        });
        if (!isLandloardExists) {
            throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Landlord not found");
        }
        if (getProperty.landlordId !== isLandloardExists.id) {
            throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "This is not you property contract");
        }
    }
    else if (isUserExits.userType === "Agency") {
        const isAgencyExists = yield prisma_1.default.agency.findFirst({
            where: { userId },
        });
        if (!isAgencyExists) {
            throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Agency not found");
        }
        if ((getProperty === null || getProperty === void 0 ? void 0 : getProperty.agencyId) !== (isAgencyExists === null || isAgencyExists === void 0 ? void 0 : isAgencyExists.id)) {
            throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "This is not you property contract");
        }
    }
    else {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorize access");
    }
    const result = yield prisma_1.default.contract.update({
        where: { id },
        data: { isDeleted: true },
    });
    return result;
});
exports.ContractServices = {
    createContractIntoDb,
    getContractsFromDb,
    getMyContracts,
    getSingleContract,
    deleteContract,
};
