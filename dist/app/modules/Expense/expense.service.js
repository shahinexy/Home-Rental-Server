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
exports.ExpenseService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createExpenseIntoDb = (payload, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
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
        //create Expense
        const createExpense = yield prisma.expense.create({
            data: Object.assign(Object.assign({}, payload), { image, date }),
        });
        return createExpense;
    }));
    return result;
});
const getExpenseFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.expense.findMany();
    return result;
});
const getSingleExpenses = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.expense.findFirst({
        where: { id },
    });
    return result;
});
exports.ExpenseService = {
    createExpenseIntoDb,
    getExpenseFromDb,
    getSingleExpenses,
};
