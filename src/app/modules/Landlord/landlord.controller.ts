import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { LandlordService } from "./landlord.service";

const createLandlord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await LandlordService.createLandlordIntoDb(req.body, id);
  sendResponse(res, {
    message: "Landlord Created successfully!",
    data: result,
  });
});

// get all Landlord form db
const getLandlords = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getLandlordsFromDb();
  sendResponse(res, {
    message: "Landlords retrieved successfully!",
    data: result,
  });
});

export const LandlordController = {
  createLandlord,
  getLandlords,
};
