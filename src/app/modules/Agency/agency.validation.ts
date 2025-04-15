import { z } from "zod";

const CreateAgencyValidationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number seems too short"),
});

const AgencyLoginValidationSchema = z.object({
  email: z.string().email("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const AgencyUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  promoCode: z.string().optional(),
  profession: z.string().optional(),
});

export const AgencyValidation = {
  CreateAgencyValidationSchema,
  AgencyLoginValidationSchema,
  AgencyUpdateSchema,
};
