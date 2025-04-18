import prisma from "../../../shared/prisma";

const getFinance = async () => {
  const totalExpense = await prisma.expense.aggregate({
    _sum: {
      expenseAmount: true,
    },
  });

  return { totalExpense: totalExpense._sum.expenseAmount || 0 };
};

export const FinanceService = {
  getFinance,
};
