"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandlordValidation = void 0;
const zod_1 = require("zod");
const CreateLandlordValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    emiratesIdOrPassport: zod_1.z
        .string()
        .min(1, "Emirates ID or Passport is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(7, "Phone number is too short"),
});
exports.LandlordValidation = {
    CreateLandlordValidationSchema,
};
