import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { FinanceController } from "./finance.controller";

const router = express.Router();

router.get("/", FinanceController.getFinance);

export const FinanceRoutes = router;
