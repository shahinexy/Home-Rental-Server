import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { ContractValidation } from "./contract.validation";
import { ContractControllers } from "./contract.controller";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.Landlord),
    validateRequest(ContractValidation.CreateContractValidationSchema),
    ContractControllers.createContract
  );

router.get("/", ContractControllers.getContracts);

export const ContractRoutes = router;
