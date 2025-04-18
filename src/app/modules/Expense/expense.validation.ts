import { z } from "zod";

const CreateExpenseValidationSchema = z.object({
  expenseAmount: z.coerce.number().positive(),
  expenseCategory: z.string(),
  date: z.coerce.date(),
  paymentMethod: z.string(),
  image: z.string().url().optional(), 
  description: z.string(),
  propertyId: z.string(),
});

export const ExpenseValidation = {
  CreateExpenseValidationSchema,
};
