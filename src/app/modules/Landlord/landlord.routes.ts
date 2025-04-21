import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { LandlordValidation } from "./landlord.validation";
import { LandlordController } from "./landlord.controller";

const router = express.Router();

router
  .route("/")
  .get(LandlordController.getLandlords)
  .post(
    auth(UserType.User, UserType.Agency),
    validateRequest(LandlordValidation.CreateLandlordValidationSchema),
    LandlordController.createLandlord
  );

router.get(
  "/agency",
  auth(UserType.Agency),
  LandlordController.getAgencyLandlord
);

export const LandlordRoutes = router;
