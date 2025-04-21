import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { LandlordService } from "./landlord.service";

const createLandlord = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await LandlordService.createLandlordIntoDb(req.body, id);
  sendResponse(res, {
    message: "Landlord Created successfully!",
    data: result,
  });
});

const getLandlords = catchAsync(async (req, res) => {
  const result = await LandlordService.getLandlordsFromDb();
  sendResponse(res, {
    message: "Landlords retrieved successfully!",
    data: result,
  });
});

const getAgencyLandlord = catchAsync(async (req, res) => {
  const result = await LandlordService.getAgencyLandlord(req.user.id);
  sendResponse(res, {
    message: "Landlords retrieved successfully!",
    data: result,
  });
});

export const LandlordController = {
  createLandlord,
  getLandlords,
  getAgencyLandlord,
};
