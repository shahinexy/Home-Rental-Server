import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPropertyFilterRequest, TProperty } from "./property.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { propertySearchAbleFields } from "./property.costant";
import { getDaysUntilExpiration } from "./property.utils";

const createPropertyIntoDb = async (payload: TProperty, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    isUserExits.userType !== "Landlord" &&
    isUserExits.userType !== "Agency"
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  if (isUserExits.userType === "Landlord") {
    const landlord = await prisma.landlord.findFirst({
      where: { userId },
    });

    if (!landlord) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Landlord profile not found");
    }

    const result = await prisma.property.create({
      data: { ...payload, landlordId: landlord.id },
    });

    return result;
  } else if (isUserExits.userType === "Agency") {
    const agency = await prisma.agency.findFirst({
      where: { userId },
    });

    if (!agency) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Agency profile not found");
    }

    const result = await prisma.property.create({
      data: { ...payload, agencyId: agency.id },
    });

    return result;
  }
};

const getPropertysFromDb = async () => {
  const result = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getMyProperty = async (
  userId: string,
  params: IPropertyFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.PropertyWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: propertySearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.PropertyWhereInput = { AND: andCondions };

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let profileId: string | undefined;

  if (user.userType === "Landlord") {
    const isLandlordExists = await prisma.landlord.findFirst({
      where: { userId },
    });

    if (!isLandlordExists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Setup your profile as landlord"
      );
    }

    profileId = isLandlordExists.id;
  } else if (user.userType === "Agency") {
    const isAgencyExists = await prisma.agency.findFirst({
      where: { userId },
    });

    if (!isAgencyExists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Setup your profile as agency"
      );
    }

    profileId = isAgencyExists.id;
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const properties = await prisma.property.findMany({
    where: {
      ...whereConditons,
      ...(user.userType === "Landlord"
        ? { landlordId: profileId }
        : { agencyId: profileId }),
    },
    skip,
    include: {
      landlord: true,
    },
  });

  const enriched = properties.map((p) => ({
    ...p,
    daysLeft: p.contractExpiresAt
      ? getDaysUntilExpiration(p.contractExpiresAt)
      : null,
  }));

  const result = enriched.sort((a, b) => {
    if (a.daysLeft === null) return 1;
    if (b.daysLeft === null) return -1;
    return a.daysLeft - b.daysLeft;
  });

  return result;
};

const getSingleProperty = async (id: string) => {
  const result = await prisma.property.findFirst({
    where: { id },
    include: { payment: true },
  });

  return result;
};

export const PropertyService = {
  createPropertyIntoDb,
  getPropertysFromDb,
  getMyProperty,
  getSingleProperty,
};
