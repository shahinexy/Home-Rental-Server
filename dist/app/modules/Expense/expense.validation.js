"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseValidation = void 0;
const zod_1 = require("zod");
const CreateExpenseValidationSchema = zod_1.z.object({
    expenseAmount: zod_1.z.coerce.number().positive(),
    expenseCategory: zod_1.z.string(),
    date: zod_1.z.coerce.date(),
    paymentMethod: zod_1.z.string(),
    image: zod_1.z.string().url().optional(),
    description: zod_1.z.string(),
    propertyId: zod_1.z.string(),
});
exports.ExpenseValidation = {
    CreateExpenseValidationSchema,
};
