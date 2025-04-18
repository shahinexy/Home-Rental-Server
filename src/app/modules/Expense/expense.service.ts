import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { fileUploader } from "../../../helpars/fileUploader";
import { TExpense } from "./expense.interface";

const createExpenseIntoDb = async (payload: TExpense, imageFile: any) => {
  const property = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const date = new Date(payload.date).toISOString();

  const result = await prisma.$transaction(async (prisma) => {
    // upload image
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    //create Expense
    const createExpense = await prisma.expense.create({
      data: { ...payload, image, date },
    });

    return createExpense;
  });

  return result;
};

const getExpenseFromDb = async () => {
  const result = await prisma.expense.findMany();
  return result;
};

const getSingleExpenses = async (id: string) => {
  const result = await prisma.expense.findFirst({
    where: { id },
  });
  return result;
};

export const ExpenseService = {
  createExpenseIntoDb,
  getExpenseFromDb,
  getSingleExpenses,
};
