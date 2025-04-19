"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceValidation = void 0;
const zod_1 = require("zod");
const CreateMaintenanceValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    priority: zod_1.z.enum(["Urgent", "Medium", "Low"]),
    date: zod_1.z.coerce.date().transform((d) => d.toISOString()),
    time: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in HH:MM 24-hour format",
    }),
    image: zod_1.z.string().optional(),
    description: zod_1.z.string(),
});
exports.MaintenanceValidation = {
    CreateMaintenanceValidationSchema,
};
