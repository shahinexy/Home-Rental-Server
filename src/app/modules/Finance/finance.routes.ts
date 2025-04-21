import express, { NextFunction, Request, Response } from "express";
import { FinanceController } from "./finance.controller";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";

const router = express.Router();

router.get(
  "/:id",
  auth(UserType.Agency, UserType.Landlord),
  FinanceController.getFinance
);

export const FinanceRoutes = router;
