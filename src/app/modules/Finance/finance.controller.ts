import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { FinanceService } from "./finance.service";


// get all Finance form db
const getFinance = catchAsync(async (req, res) => {
  const result = await FinanceService.getFinance(req.params.id);
  sendResponse(res, {
    message: "Finances retrieved successfully!",
    data: result,
  });
});

export const FinanceController = {
  getFinance,
};
