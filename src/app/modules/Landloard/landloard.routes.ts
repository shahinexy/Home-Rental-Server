import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LandloardValidation } from "./landloard.validation";
import { LandloardController } from "./landloard.controller";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.User),
    validateRequest(LandloardValidation.CreateLandloardValidationSchema),
    LandloardController.createLandloard
  );

router.get("/", LandloardController.getLandloards);

export const LandloardRoutes = router;
