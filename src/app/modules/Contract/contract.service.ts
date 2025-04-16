import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TContract } from "./contract.interface";

const createContractIntoDb = async (payload: TContract, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isLandlordExists = await prisma.landlord.findFirst({
    where: { userId },
  });

  if (!isLandlordExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Setup your profile as landlord");
  }

  const isPropertyExists = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!isPropertyExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if(isPropertyExists.landlordId !== isLandlordExists.id){
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  const isContractAlreadyExists = await prisma.contract.findFirst({
    where: { propertyId: payload.propertyId },
  });

  if (isContractAlreadyExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Property contract already exists"
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    // create Contract
    const createTenant = await prisma.contract.create({
      data: { ...payload, tenantId: isTenantExists.id },
    });

    // update property
    const contractExpiresAt = new Date();
    contractExpiresAt.setDate(contractExpiresAt.getDate() + 100);

    const updateUser = await prisma.property.update({
      where: { id: payload.propertyId },
      data: {
        isContractCreated: true,
        contractExpiresAt,
      },
    });

    return createTenant;
  });

  return result;
};

const getContractsFromDb = async () => {
  const result = await prisma.contract.findMany({
    include: { property: true },
  });

  return result;
};

const getMyContracts = async (
  userId: string,
) => {

  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isTenantExists = await prisma.tenant.findFirst({
    where: { userId },
  });

  if (!isTenantExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Setup your profile as tenant");
  }

  const isContractExists = await prisma.landlord.findFirst({
    where: { userId },
  });

  if (!isLandloardExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Setup your profile as landloard"
    );
  }

  const result = await prisma.property.findMany({
    where: { landlordId: isLandloardExists.id },
    include: {
      landlord: true,
    },
  });


  return result;
};


export const ContractServices = {
  createContractIntoDb,
  getContractsFromDb,
};
