import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { PropertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await PropertyService.createPropertyIntoDb(req.body, id);
  sendResponse(res, {
    message: "Property Created successfully!",
    data: result,
  });
});

// get all Property form db
const getPropertys = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getPropertysFromDb();
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

// get all Property form db
const getMyProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await PropertyService.getMyProperty(id);
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getPropertys,
  getMyProperty
};
