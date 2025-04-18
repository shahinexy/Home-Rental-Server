import { z } from "zod";

const CreateDocumentValidationSchema = z.object({
  floorPlan: z.string().optional(),
  titleDeed: z.string().optional(),
  emiratesID: z.string().optional(),
  passportID: z.string().optional(),
  passport: z.string().optional(),
  visa: z.string().optional(),
  propertyId: z.string(),
});

export const DocumentValidation = {
  CreateDocumentValidationSchema,
};
