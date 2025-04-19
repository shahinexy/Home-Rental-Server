"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyValidation = void 0;
const zod_1 = require("zod");
const CreatePropertyValidationSchema = zod_1.z.object({
    propertyName: zod_1.z.string().min(1, "Property name is required"),
    propertyType: zod_1.z.string().min(1, "Property type is required"),
    buildingName: zod_1.z.string().min(1, "Building name is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    maknaiNumber: zod_1.z.string().min(1, "Maknai number is required"),
    propertyArea: zod_1.z.string().min(1, "Property area is required"),
    totalFloor: zod_1.z.number().int().min(1, "Total floors must be at least 1"),
    totalRooms: zod_1.z.number().int().min(1, "Total rooms must be at least 1"),
    description: zod_1.z.string().min(1, "Description is required")
});
exports.PropertyValidation = {
    CreatePropertyValidationSchema,
};
