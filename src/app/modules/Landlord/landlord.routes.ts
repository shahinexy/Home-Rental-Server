import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { LandlordValidation } from "./landlord.validation";
import { LandlordController } from "./landlord.controller";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.User),
    validateRequest(LandlordValidation.CreateLandlordValidationSchema),
    LandlordController.createLandlord
  );

router.get("/", LandlordController.getLandlords);

export const LandlordRoutes = router;
