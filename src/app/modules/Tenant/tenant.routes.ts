import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { TenantValidation } from "./tenant.validation";
import { TenantController } from "./tenant.controller";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.User),
    validateRequest(TenantValidation.CreateTenantValidationSchema),
    TenantController.createTenant
  );

router.get("/", TenantController.getTenants);

export const TenantRoutes = router;
