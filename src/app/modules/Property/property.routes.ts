import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { PropertyValidation } from "./property.validation";
import { PropertyController } from "./property.controller";

const router = express.Router();

router
  .route("/")
  .get(PropertyController.getPropertys)
  .post(
    auth(UserType.Landlord),
    validateRequest(PropertyValidation.CreatePropertyValidationSchema),
    PropertyController.createProperty
  );

router.get(
  "/my-propertys",
  auth(UserType.Landlord),
  PropertyController.getMyProperty
);

export const PropertyRoutes = router;
