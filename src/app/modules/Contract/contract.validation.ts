import { z } from "zod";

const CreateContractValidationSchema = z.object({
  tenantName: z.string(),
  emiratesID: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  deposit: z.number(),
  totalRent: z.number(),
  payment: z.string(),
  numberPayments: z.number().int(),
  isDeleted: z.boolean().default(false),
  propertyId: z.string(),
});

export const ContractValidation = {
  CreateContractValidationSchema,
};
