import express, { NextFunction, Request, Response } from "express";
import { FinanceController } from "./finance.controller";

const router = express.Router();

router.get("/", FinanceController.getFinance);

export const FinanceRoutes = router;
