import { z } from "zod";

const CreateMaintenanceValidationSchema = z.object({
  title: z.string(),
  priority: z.enum(["Urgent", "Medium", "Low"]),
  date: z.coerce.date().transform((d) => d.toISOString()),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in HH:MM 24-hour format",
  }),
  image: z.string().optional(),
  description: z.string(),
});

export const MaintenanceValidation = {
  CreateMaintenanceValidationSchema,
};
