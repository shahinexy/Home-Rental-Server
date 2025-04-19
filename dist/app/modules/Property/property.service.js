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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const property_costant_1 = require("./property.costant");
const property_utils_1 = require("./property.utils");
const createPropertyIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (isUserExits.userType !== "Landlord" &&
        isUserExits.userType !== "Agency") {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    if (isUserExits.userType === "Landlord") {
        const landlord = yield prisma_1.default.landlord.findFirst({
            where: { userId },
        });
        if (!landlord) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Landlord profile not found");
        }
        const result = yield prisma_1.default.property.create({
            data: Object.assign(Object.assign({}, payload), { landlordId: landlord.id }),
        });
        return result;
    }
    else if (isUserExits.userType === "Agency") {
        const agency = yield prisma_1.default.agency.findFirst({
            where: { userId },
        });
        if (!agency) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Agency profile not found");
        }
        const result = yield prisma_1.default.property.create({
            data: Object.assign(Object.assign({}, payload), { agencyId: agency.id }),
        });
        return result;
    }
});
const getPropertysFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findMany({
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getMyProperty = (userId, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: property_costant_1.propertySearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    let profileId;
    if (user.userType === "Landlord") {
        const isLandlordExists = yield prisma_1.default.landlord.findFirst({
            where: { userId },
        });
        if (!isLandlordExists) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Setup your profile as landlord");
        }
        profileId = isLandlordExists.id;
    }
    else if (user.userType === "Agency") {
        const isAgencyExists = yield prisma_1.default.agency.findFirst({
            where: { userId },
        });
        if (!isAgencyExists) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Setup your profile as agency");
        }
        profileId = isAgencyExists.id;
    }
    else {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const properties = yield prisma_1.default.property.findMany({
        where: Object.assign(Object.assign({}, whereConditons), (user.userType === "Landlord"
            ? { landlordId: profileId }
            : { agencyId: profileId })),
        skip,
        include: {
            landlord: true,
        },
    });
    const enriched = properties.map((p) => (Object.assign(Object.assign({}, p), { daysLeft: p.contractExpiresAt
            ? (0, property_utils_1.getDaysUntilExpiration)(p.contractExpiresAt)
            : null })));
    const result = enriched.sort((a, b) => {
        if (a.daysLeft === null)
            return 1;
        if (b.daysLeft === null)
            return -1;
        return a.daysLeft - b.daysLeft;
    });
    return result;
});
const getSingleProperty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findFirst({
        where: { id },
    });
    return result;
});
exports.PropertyService = {
    createPropertyIntoDb,
    getPropertysFromDb,
    getMyProperty,
    getSingleProperty,
};
