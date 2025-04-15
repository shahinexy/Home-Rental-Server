import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AgencyValidation } from "./agency.validation";
import { AgencyController } from "./agency.controller";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.User),
    validateRequest(AgencyValidation.CreateAgencyValidationSchema),
    AgencyController.createAgency
  );

router.get("/", AgencyController.getAgencys);

export const AgencyRoutes = router;
