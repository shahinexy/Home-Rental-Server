import { z } from "zod";

const CreateMaintenanceValidationSchema = z.object({
  title: z.string(),
  priority: z.enum(["Urgent", "Medium", "Low"]),
  date: z.coerce.date(),
  time: z.string(),
  image: z.string().optional(),
  description: z.string(),
});

export const MaintenanceValidation = {
  CreateMaintenanceValidationSchema,
};
