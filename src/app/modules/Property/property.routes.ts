import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { PropertyValidation } from "./property.validation";
import { PropertyController } from "./property.controller";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserType.Agency, UserType.Landlord, UserType.Tenant, UserType.User),
    PropertyController.getPropertys
  )
  .post(
    auth(UserType.Landlord, UserType.Agency),
    validateRequest(PropertyValidation.CreatePropertyValidationSchema),
    PropertyController.createProperty
  );

router.get(
  "/my-properties",
  auth(UserType.Landlord, UserType.Agency),
  PropertyController.getMyProperty
);

router.get(
  "/:id",
  auth(UserType.Agency, UserType.Landlord, UserType.Tenant),
  PropertyController.getSingleProperty
);

export const PropertyRoutes = router;
