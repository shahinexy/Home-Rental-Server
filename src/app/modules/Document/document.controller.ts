import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DocumentService } from "./document.service";

const createDocument = catchAsync(async (req, res) => {
  const result = await DocumentService.createDocumentIntoDb(
    req.body,
    req.files,
  );
  sendResponse(res, {
    message: "Document Created successfully!",
    data: result,
  });
});

const getDocuments = catchAsync(async (req, res) => {
  const result = await DocumentService.getDocumentFromDb();
  sendResponse(res, {
    message: "Documents retrieved successfully!",
    data: result,
  });
});

const getSingleDocuments = catchAsync(async (req, res) => {
  const result = await DocumentService.getSingleDocuments(req.params.id);
  sendResponse(res, {
    message: "Documents retrieved successfully!",
    data: result,
  });
});


export const DocumentController = {
  createDocument,
  getDocuments,
  getSingleDocuments,
};
