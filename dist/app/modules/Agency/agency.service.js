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
exports.AgencyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
// Create a new user in the database.
const createAgencyIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExits = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExits) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (isUserExits.isProfileSetUp === true) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Profile setup already completed");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // create agency
        const createAgecy = yield prisma.agency.create({
            data: Object.assign(Object.assign({}, payload), { userType: "Agency", userId }),
        });
        // update user
        const updateUser = yield prisma.user.update({
            where: { id: userId },
            data: {
                isProfileSetUp: true,
                userType: "Agency",
            },
        });
        return createAgecy;
    }));
    return result;
});
// reterive all Agencys from the database also searcing anf filetering
const getAgencysFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.agency.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    return result;
});
exports.AgencyService = {
    createAgencyIntoDb,
    getAgencysFromDb,
};
