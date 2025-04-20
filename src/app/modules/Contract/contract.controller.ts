import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { ContractServices } from "./contract.service";

const createContract = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await ContractServices.createContractIntoDb(req.body, id);
  sendResponse(res, {
    message: "Contract Created successfully!",
    data: result,
  });
});

const getContracts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContractServices.getContractsFromDb();
  sendResponse(res, {
    message: "Contracts retrieved successfully!",
    data: result,
  });
});

const getMyContracts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await ContractServices.getMyContracts(id);
  sendResponse(res, {
    message: "Contracts retrieved successfully!",
    data: result,
  });
});

const getSingleContract = catchAsync(async (req: Request, res: Response) => {
  const result = await ContractServices.getSingleContract(req.params.id);
  sendResponse(res, {
    message: "Contracts retrieved successfully!",
    data: result,
  });
});

const getPropertyContract = catchAsync(async (req: Request, res: Response) => {
  const result = await ContractServices.getPropertyContract(req.params.propertyId);
  sendResponse(res, {
    message: "Contracts retrieved successfully!",
    data: result,
  });
});

const deleteContract = catchAsync(async (req: Request, res: Response) => {
  const result = await ContractServices.deleteContract(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Contracts retrieved successfully!",
    data: result,
  });
});

export const ContractControllers = {
  createContract,
  getContracts,
  getMyContracts,
  getSingleContract,
  getPropertyContract,
  deleteContract,
};
