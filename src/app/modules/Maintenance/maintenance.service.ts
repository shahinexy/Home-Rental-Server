import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TMaintenance } from "./maintenance.interface";
import { fileUploader } from "../../../helpars/fileUploader";

const createMaintenanceIntoDb = async (
  payload: TMaintenance,
  imageFile: any,
  userId: string
) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const tenant = await prisma.tenant.findFirst({
    where: { userId },
  });

  if (!tenant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tenant not found");
  }

  const property = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    // upload image
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    //create user profile
    const createMaintenance = await prisma.maintenance.create({
      data: { ...payload, image, tenantId: tenant.id },
    });

    return createMaintenance;
  });

  return result;
};

const getMaintenancesFromDb = async () => {
  const result = await prisma.maintenance.findMany();
  return result;
};

const getSingleMaintenances = async (id: string) => {
  const result = await prisma.maintenance.findFirst({
    where: { id },
  });
  return result;
};

const markComleted = async (id: string) => {
  const result = await prisma.maintenance.update({
    where: { id },
    data: { isCompleted: true },
  });
  return result;
};

export const MaintenanceService = {
  createMaintenanceIntoDb,
  getMaintenancesFromDb,
  getSingleMaintenances,
  markComleted,
};
