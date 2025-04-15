import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { TAgency } from "./landloard.interface";
import httpStatus from "http-status";

// Create a new user in the database.
const createLandloardIntoDb = async (payload: TLandloard, userId: string) => {
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
    // create Landloard
    const createAgecy = await prisma.Landloard.create({
      data: { ...payload, uerType: "Landloard", userId },
    });

    // update user
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileSetUp: true,
        uerType: "Landloard",
      },
    });

    return createAgecy;
  });

  return result;
};

// reterive all Landloards from the database also searcing anf filetering
const getLandloardsFromDb = async () => {
  const result = await prisma.Landloard.findMany({
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

export const LandloardService = {
  createLandloardIntoDb,
  getLandloardsFromDb,
};
