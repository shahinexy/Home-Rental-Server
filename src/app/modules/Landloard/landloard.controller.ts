import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { LandloardService } from "./landloard.service";

const createLandloard = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.user
  const result = await LandloardService.createLandloardIntoDb(req.body, id);
  sendResponse(res, {
    message: "Landloard Created successfully!",
    data: result,
  });
});

// get all Landloard form db
const getLandloards = catchAsync(async (req: Request, res: Response) => {
  const result = await LandloardService.getLandloardsFromDb();
  sendResponse(res, {
    message: "Landloards retrieved successfully!",
    data: result,
  });
});

export const LandloardController = {
  createLandloard,
  getLandloards,
};
