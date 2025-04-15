import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TLandlord } from "./landlord.interface";

// Create a new user in the database.
const createLandlordIntoDb = async (payload: TLandlord, userId: string) => {
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
    // create Landlord
    const createAgecy = await prisma.landlord.create({
      data: { ...payload, userType: "Landlord", userId },
    });

    // update user
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileSetUp: true,
        userType: "Landlord",
      },
    });

    return createAgecy;
  });

  return result;
};

// reterive all Landlords from the database also searcing anf filetering
const getLandlordsFromDb = async () => {
  const result = await prisma.landlord.findMany({
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

export const LandlordService = {
  createLandlordIntoDb,
  getLandlordsFromDb,
};
