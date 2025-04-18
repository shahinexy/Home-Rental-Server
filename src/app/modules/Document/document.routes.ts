import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserType } from "@prisma/client";
import { DocumentController } from "./document.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import { DocumentValidation } from "./document.validation";

const router = express.Router();

router
  .route("/")
  .get(DocumentController.getDocuments)
  .post(
    auth(UserType.Tenant, UserType.Agency, UserType.Landlord),
    fileUploader.documents,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(DocumentValidation.CreateDocumentValidationSchema),
    DocumentController.createDocument
  );

router.route("/:id").get(DocumentController.getSingleDocuments);

export const DocumentRoutes = router;
