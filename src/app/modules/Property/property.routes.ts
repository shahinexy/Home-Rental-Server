import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { PropertyValidation } from "./property.validation";
import { PropertyController } from "./property.controller";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserType.Agency),
    validateRequest(PropertyValidation.CreatePropertyValidationSchema),
    PropertyController.createProperty
  );

router.get("/", PropertyController.getPropertys);

export const PropertyRoutes = router;
