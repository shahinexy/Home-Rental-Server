import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

// get all Payment form db
const getPropertyPayments = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const result = await PaymentService.getPropertyPayments(propertyId);
  sendResponse(res, {
    message: "Payments retrieved successfully!",
    data: result,
  });
});

export const PaymentController = {
  getPropertyPayments,
};
