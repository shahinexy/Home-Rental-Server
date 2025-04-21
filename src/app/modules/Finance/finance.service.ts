import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const getFinance = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: { id },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const propertyContract = await prisma.contract.findFirst({
    where: { propertyId: property.id },
  });

  if (!propertyContract) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property contract not found");
  }

  const totalExpense = await prisma.expense.aggregate({
    where: { propertyId: id },
    _sum: {
      expenseAmount: true,
    },
  });

  return {
    totalExpense: totalExpense._sum.expenseAmount || 0,
    income: propertyContract.totalRent,
    netIncome:
      propertyContract.totalRent - (totalExpense._sum.expenseAmount || 0),
  };
};

export const FinanceService = {
  getFinance,
};
