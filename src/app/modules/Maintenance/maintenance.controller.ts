import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MaintenanceService } from "./maintenance.service";

const createMaintenance = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await MaintenanceService.createMaintenanceIntoDb(
    req.body,
    req.file,
    id
  );
  sendResponse(res, {
    message: "Maintenance Created successfully!",
    data: result,
  });
});

const getMaintenances = catchAsync(async (req, res) => {
  const result = await MaintenanceService.getMaintenancesFromDb();
  sendResponse(res, {
    message: "Maintenances retrieved successfully!",
    data: result,
  });
});

const getSingleMaintenances = catchAsync(async (req, res) => {
  const result = await MaintenanceService.getSingleMaintenances(req.params.id);
  sendResponse(res, {
    message: "Maintenances retrieved successfully!",
    data: result,
  });
});

const markComleted = catchAsync(async (req, res) => {
  const result = await MaintenanceService.markComleted(req.params.id);
  sendResponse(res, {
    message: "Maintenances updated successfully!",
    data: result,
  });
});

export const MaintenanceController = {
  createMaintenance,
  getMaintenances,
  getSingleMaintenances,
  markComleted
};
