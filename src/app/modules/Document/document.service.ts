import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpars/fileUploader";
import { TDocument } from "./document.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createDocumentIntoDb = async (payload: TDocument, documents: any) => {
  const property = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const uploadedData: Partial<TDocument> = {};

  const documnetFields = [
    "floorPlan",
    "titleDeed",
    "emiratesID",
    "passportID",
    "passport",
    "visa",
  ];

  for (const field of documnetFields) {
    const file = documents[field]?.[0];
    if (file) {
      const uploaded = await fileUploader.uploadToCloudinary(file);
      uploadedData[field as keyof TDocument] = uploaded?.Location || "";
    }
  }

  const existingDocument = await prisma.document.findFirst({
    where: { propertyId: payload.propertyId },
  });

  if (!existingDocument) {
    //create documents
    const result = await prisma.document.create({
      data: { ...uploadedData, propertyId: payload.propertyId },
    });

    return result;
  } else {
    //update documents
    const result = await prisma.document.update({
      where: { id: existingDocument.id },
      data: { ...uploadedData, propertyId: payload.propertyId },
    });

    return result;
  }
};

const getDocumentFromDb = async () => {
  const result = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getSingleDocuments = async (id: string) => {
  const result = await prisma.document.findFirst({
    where: { id },
  });
  return result;
};

export const DocumentService = {
  createDocumentIntoDb,
  getDocumentFromDb,
  getSingleDocuments,
};
