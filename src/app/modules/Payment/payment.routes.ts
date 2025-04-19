import express, { NextFunction, Request, Response } from "express";
import { PaymentController } from "./Payment.controller";

const router = express.Router();

router.get("/:propertyId", PaymentController.getPropertyPayments);

export const PaymentRoutes = router;
