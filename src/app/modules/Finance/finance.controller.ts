import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { FinanceService } from "./Finance.service";


// get all Finance form db
const getFinance = catchAsync(async (req: Request, res: Response) => {
  const result = await FinanceService.getFinance();
  sendResponse(res, {
    message: "Finances retrieved successfully!",
    data: result,
  });
});

export const FinanceController = {
  getFinance,
};
