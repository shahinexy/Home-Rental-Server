import { z } from "zod";

const CreateTenantValidationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  emiratesId: z
    .string()
    .min(1, "Emirates ID or Passport is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
});

export const TenantValidation = {
  CreateTenantValidationSchema,
};
