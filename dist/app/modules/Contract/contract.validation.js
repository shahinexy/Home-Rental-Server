"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractValidation = void 0;
const zod_1 = require("zod");
const CreateContractValidationSchema = zod_1.z.object({
    tenantName: zod_1.z.string(),
    emiratesID: zod_1.z.string(),
    email: zod_1.z.string().email(),
    mobile: zod_1.z.string(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    deposit: zod_1.z.number(),
    payment: zod_1.z.string(),
    numberPayments: zod_1.z.number().int(),
    isDeleted: zod_1.z.boolean().default(false),
    propertyId: zod_1.z.string()
});
exports.ContractValidation = {
    CreateContractValidationSchema,
};
