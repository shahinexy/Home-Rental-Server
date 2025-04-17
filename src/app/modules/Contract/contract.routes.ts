import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { ContractValidation } from "./contract.validation";
import { ContractControllers } from "./contract.controller";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserType.Agency, UserType.Landlord, UserType.Tenant, UserType.User),
    ContractControllers.getContracts
  )
  .post(
    auth(UserType.Landlord, UserType.Agency),
    validateRequest(ContractValidation.CreateContractValidationSchema),
    ContractControllers.createContract
  );

router.get(
  "/my-contract",
  auth(UserType.Tenant, UserType.Agency),
  ContractControllers.getMyContracts
);

router
  .route("/:id")
  .get(
    auth(UserType.Agency, UserType.Landlord, UserType.Tenant, UserType.User),
    ContractControllers.getSingleContract
  )
  .delete(
    auth(UserType.Landlord, UserType.Agency),
    ContractControllers.deleteContract
  );

export const ContractRoutes = router;
