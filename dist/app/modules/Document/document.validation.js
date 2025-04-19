"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentValidation = void 0;
const zod_1 = require("zod");
const CreateDocumentValidationSchema = zod_1.z.object({
    floorPlan: zod_1.z.string().optional(),
    titleDeed: zod_1.z.string().optional(),
    emiratesID: zod_1.z.string().optional(),
    passportID: zod_1.z.string().optional(),
    passport: zod_1.z.string().optional(),
    visa: zod_1.z.string().optional(),
    propertyId: zod_1.z.string(),
});
exports.DocumentValidation = {
    CreateDocumentValidationSchema,
};
