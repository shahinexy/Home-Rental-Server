import express, { NextFunction, Request, Response } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";

const router = express.Router();

router.get(
  "/:propertyId",
  auth(UserType.Agency, UserType.Landlord, UserType.Tenant),
  PaymentController.getPropertyPayments
);

router.get(
  "/detail/:id",
  auth(UserType.Agency, UserType.Landlord),
  PaymentController.updatePaymentStatus
);

export const PaymentRoutes = router;
