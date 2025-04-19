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
exports.DocumentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const document_service_1 = require("./document.service");
const createDocument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield document_service_1.DocumentService.createDocumentIntoDb(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        message: "Document Created successfully!",
        data: result,
    });
}));
const getDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield document_service_1.DocumentService.getDocumentFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Documents retrieved successfully!",
        data: result,
    });
}));
const getSingleDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield document_service_1.DocumentService.getSingleDocuments(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Documents retrieved successfully!",
        data: result,
    });
}));
exports.DocumentController = {
    createDocument,
    getDocuments,
    getSingleDocuments,
};
