import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TProperty } from "./property.interface";

const createPropertyIntoDb = async (payload: TProperty, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExits.isProfileSetUp !== true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Setup your profile");
  }

  if (isUserExits.userType !== "Landlord") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const result = await prisma.property.create({
    data: payload,
  });

  return result;
};

// reterive all Propertys from the database also searcing anf filetering
const getPropertysFromDb = async () => {
  const result = await prisma.property.findMany();

  return result;
};

export const PropertyService = {
  createPropertyIntoDb,
  getPropertysFromDb,
};
