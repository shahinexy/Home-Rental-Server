import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserType } from "@prisma/client";

const router = express.Router();

// *!register user
router.post(
  "/register",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);

// *!get all  user
router.get("/", userController.getUsers);


export const userRoutes = router;
