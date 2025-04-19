"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const document_controller_1 = require("./document.controller");
const fileUploader_1 = require("../../../helpars/fileUploader");
const document_validation_1 = require("./document.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(document_controller_1.DocumentController.getDocuments)
    .post((0, auth_1.default)(client_1.UserType.Tenant, client_1.UserType.Agency, client_1.UserType.Landlord), fileUploader_1.fileUploader.documents, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(document_validation_1.DocumentValidation.CreateDocumentValidationSchema), document_controller_1.DocumentController.createDocument);
router.route("/:id").get(document_controller_1.DocumentController.getSingleDocuments);
exports.DocumentRoutes = router;
