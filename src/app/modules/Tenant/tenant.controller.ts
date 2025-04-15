import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { TenantService } from "./tenant.service";

const createTenant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TenantService.createTenantIntoDb(req.body, id);
  sendResponse(res, {
    message: "Tenant Created successfully!",
    data: result,
  });
});

// get all Tenant form db
const getTenants = catchAsync(async (req: Request, res: Response) => {
  const result = await TenantService.getTenantsFromDb();
  sendResponse(res, {
    message: "Tenants retrieved successfully!",
    data: result,
  });
});

export const TenantController = {
  createTenant,
  getTenants,
};
