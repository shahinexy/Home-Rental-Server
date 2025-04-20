import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";


const getPropertyPayments = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const result = await PaymentService.getPropertyPayments(propertyId);
  sendResponse(res, {
    message: "Payments retrieved successfully!",
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.updatePaymentStatus(id);
  sendResponse(res, {
    message: "Payments status updated successfully!",
    data: result,
  });
});

export const PaymentController = {
  getPropertyPayments,
  updatePaymentStatus
};
