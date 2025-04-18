import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ExpenseService } from "./expense.service";

const createExpense = catchAsync(async (req, res) => {
  const result = await ExpenseService.createExpenseIntoDb(req.body, req.file);
  sendResponse(res, {
    message: "Expense Created successfully!",
    data: result,
  });
});

const getExpenses = catchAsync(async (req, res) => {
  const result = await ExpenseService.getExpenseFromDb();
  sendResponse(res, {
    message: "Expenses retrieved successfully!",
    data: result,
  });
});

const getSingleExpenses = catchAsync(async (req, res) => {
  const result = await ExpenseService.getSingleExpenses(req.params.id);
  sendResponse(res, {
    message: "Expenses retrieved successfully!",
    data: result,
  });
});

export const ExpenseController = {
  createExpense,
  getExpenses,
  getSingleExpenses,
};
