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
      console.log(`Uploading ${field}:`, file.originalname);
      const uploaded = await fileUploader.uploadToCloudinary(file);
      console.log(`Uploaded ${field} →`, uploaded?.Location);
      uploadedData[field as keyof TDocument] = uploaded?.Location || "";
      // console.log(`\nField: ${field}`);
      // console.log(`Original name: ${file.originalname}`);
      // console.log(`Buffer first 10 bytes:`, file.buffer?.subarray(0, 10));
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
  const result = await prisma.document.findMany();
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
