import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { AgencyService } from "./agency.service";

const createAgency = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.user
  const result = await AgencyService.createAgencyIntoDb(req.body, id);
  sendResponse(res, {
    message: "Agency Created successfully!",
    data: result,
  });
});

// get all Agency form db
const getAgencys = catchAsync(async (req: Request, res: Response) => {
  const result = await AgencyService.getAgencysFromDb();
  sendResponse(res, {
    message: "Agencys retrieved successfully!",
    data: result,
  });
});

export const AgencyController = {
  createAgency,
  getAgencys,
};
