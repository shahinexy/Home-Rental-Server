import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PropertyService } from "./property.service";
import { propertyFilterableFields } from "./property.costant";
import pick from "../../../shared/pick";

const createProperty = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await PropertyService.createPropertyIntoDb(req.body, id);
  sendResponse(res, {
    message: "Property Created successfully!",
    data: result,
  });
});

const getPropertys = catchAsync(async (req, res) => {
  const result = await PropertyService.getPropertysFromDb();
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

const getMyProperty = catchAsync(async (req, res) => {
  const filters = pick(req.query, propertyFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const { id } = req.user;

  const result = await PropertyService.getMyProperty(id, filters, options);
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

const getPropertyByAgency = catchAsync(async (req, res) => {
  const result = await PropertyService.getPropertyByAgency(req.params.landlordId);
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const result = await PropertyService.getSingleProperty(req.params.id);
  sendResponse(res, {
    message: "Propertys retrieved successfully!",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getPropertys,
  getMyProperty,
  getPropertyByAgency,
  getSingleProperty,
};
