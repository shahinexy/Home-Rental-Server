import { z } from "zod";

const CreatePropertyValidationSchema = z.object({
  propertyName: z.string().min(1, "Property name is required"),
  propertyType: z.string().min(1, "Property type is required"),
  buildingName: z.string().min(1, "Building name is required"),
  location: z.string().min(1, "Location is required"),
  maknaiNumber: z.string().min(1, "Maknai number is required"),
  propertyArea: z.string().min(1, "Property area is required"),
  totalFloor: z.number().int().min(1, "Total floors must be at least 1"),
  totalRooms: z.number().int().min(1, "Total rooms must be at least 1"),
  description: z.string().min(1, "Description is required"),
  landlordId: z.string().min(1, "landlord Id is required"),
});

export const PropertyValidation = {
  CreatePropertyValidationSchema,
};
