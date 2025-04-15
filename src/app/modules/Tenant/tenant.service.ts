import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TTenant } from "./tenant.interface";

// Create a new user in the database.
const createTenantIntoDb = async (payload: TTenant, userId: string) => {
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
    // create Tenant
    const createAgecy = await prisma.tenant.create({
      data: { ...payload, uerType: "Tenant", userId },
    });

    // update user
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isProfileSetUp: true,
        uerType: "Tenant",
      },
    });

    return createAgecy;
  });

  return result;
};

// reterive all Tenants from the database also searcing anf filetering
const getTenantsFromDb = async () => {
  const result = await prisma.tenant.findMany({
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

export const TenantService = {
  createTenantIntoDb,
  getTenantsFromDb,
};
