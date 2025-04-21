import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TLandlord } from "./landlord.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const createLandlordIntoDb = async (payload: TLandlord, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: { agency: true },
  });

  console.log(isUserExits);

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const hashedPassword: string = await bcrypt.hash(
    "12345678",
    Number(config.bcrypt_salt_rounds)
  );

  // ========== start transaction =========
  const result = await prisma.$transaction(async (prisma) => {
    if (isUserExits.userType === "Agency") {
      const existingEmail = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (existingEmail) {
        throw new ApiError(httpStatus.CONFLICT, "Email already exists");
      }

      const createUser = await prisma.user.create({
        data: { email: payload.email, password: hashedPassword },
      });

      if (!createUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
      }

      // create Landlord
      const createLandlord = await prisma.landlord.create({
        data: {
          ...payload,
          userType: "Landlord",
          agencyId: isUserExits.agency[0].id,
          userId: createUser.id,
        },
      });

      // update user
      await prisma.user.update({
        where: { id: createUser.id },
        data: {
          isProfileSetUp: true,
          userType: "Landlord",
        },
      });

      return createLandlord;
    }

    if (isUserExits.isProfileSetUp === true) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Profile setup already completed"
      );
    }

    // create Landlord
    const createLandlord = await prisma.landlord.create({
      data: { ...payload, userType: "Landlord", userId },
    });

    // update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileSetUp: true,
        userType: "Landlord",
      },
    });

    return createLandlord;
  });

  return result;
};

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

const getAgencyLandlord = async (userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: { agency: true },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.landlord.findMany({
    where: { agencyId: isUserExits.agency[0].id },
  });

  return result;
};

export const LandlordService = {
  createLandlordIntoDb,
  getLandlordsFromDb,
  getAgencyLandlord
};
