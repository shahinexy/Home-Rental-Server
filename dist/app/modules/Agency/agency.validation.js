"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyValidation = void 0;
const zod_1 = require("zod");
const CreateAgencyValidationSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1, "Company name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(1, "Phone number seems too short"),
});
const AgencyLoginValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email is required"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .nonempty("Password is required"),
});
const AgencyUpdateSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    promoCode: zod_1.z.string().optional(),
    profession: zod_1.z.string().optional(),
});
exports.AgencyValidation = {
    CreateAgencyValidationSchema,
    AgencyLoginValidationSchema,
    AgencyUpdateSchema,
};
