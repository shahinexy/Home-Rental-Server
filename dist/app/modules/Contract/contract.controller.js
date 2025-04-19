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
exports.ContractControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const contract_service_1 = require("./contract.service");
const createContract = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield contract_service_1.ContractServices.createContractIntoDb(req.body, id);
    (0, sendResponse_1.default)(res, {
        message: "Contract Created successfully!",
        data: result,
    });
}));
const getContracts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contract_service_1.ContractServices.getContractsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Contracts retrieved successfully!",
        data: result,
    });
}));
const getMyContracts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield contract_service_1.ContractServices.getMyContracts(id);
    (0, sendResponse_1.default)(res, {
        message: "Contracts retrieved successfully!",
        data: result,
    });
}));
const getSingleContract = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contract_service_1.ContractServices.getSingleContract(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Contracts retrieved successfully!",
        data: result,
    });
}));
const deleteContract = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contract_service_1.ContractServices.deleteContract(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Contracts retrieved successfully!",
        data: result,
    });
}));
exports.ContractControllers = {
    createContract,
    getContracts,
    getMyContracts,
    getSingleContract,
    deleteContract,
};
