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
exports.DocumentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createDocumentIntoDb = (payload, documents) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const property = yield prisma_1.default.property.findFirst({
        where: { id: payload.propertyId },
    });
    if (!property) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Property not found");
    }
    const uploadedData = {};
    const documnetFields = [
        "floorPlan",
        "titleDeed",
        "emiratesID",
        "passportID",
        "passport",
        "visa",
    ];
    for (const field of documnetFields) {
        const file = (_a = documents[field]) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const uploaded = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            uploadedData[field] = (uploaded === null || uploaded === void 0 ? void 0 : uploaded.Location) || "";
        }
    }
    const existingDocument = yield prisma_1.default.document.findFirst({
        where: { propertyId: payload.propertyId },
    });
    if (!existingDocument) {
        //create documents
        const result = yield prisma_1.default.document.create({
            data: Object.assign(Object.assign({}, uploadedData), { propertyId: payload.propertyId }),
        });
        return result;
    }
    else {
        //update documents
        const result = yield prisma_1.default.document.update({
            where: { id: existingDocument.id },
            data: Object.assign(Object.assign({}, uploadedData), { propertyId: payload.propertyId }),
        });
        return result;
    }
});
const getDocumentFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.document.findMany({
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getSingleDocuments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.document.findFirst({
        where: { id },
    });
    return result;
});
exports.DocumentService = {
    createDocumentIntoDb,
    getDocumentFromDb,
    getSingleDocuments,
};
