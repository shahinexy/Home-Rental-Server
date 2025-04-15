import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { TAgency } from "./agency.interface";
import httpStatus from "http-status";

// Create a new user in the database.
const createAgencyIntoDb = async (payload: TAgency, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExits.isProfileSetUp === true) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Profile setup already completed"
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    // create agency
    const createAgecy = await prisma.agency.create({
      data: { ...payload, userType: "Agency", userId },
    });

    // update user
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileSetUp: true,
        userType: "Agency",
      },
    });

    return createAgecy;
  });

  return result;
};

// reterive all Agencys from the database also searcing anf filetering
const getAgencysFromDb = async () => {
  const result = await prisma.agency.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return result;
};

export const AgencyService = {
  createAgencyIntoDb,
  getAgencysFromDb,
};
