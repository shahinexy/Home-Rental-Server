import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TContract } from "./contract.interface";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";

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
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Setup your profile as landlord"
    );
  }

  const isPropertyExists = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!isPropertyExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (isPropertyExists.landlordId !== isLandlordExists.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  const isContractAlreadyExists = await prisma.contract.findFirst({
    where: { propertyId: payload.propertyId },
  });

  if (isContractAlreadyExists) {
    throw new ApiError(httpStatus.CONFLICT, "Property contract already exists");
  }

  const hashedPassword: string = await bcrypt.hash(
    "12345678",
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    email: payload.email,
    password: hashedPassword,
  };

  const tenantData = {
    fullName: payload.tenantName,
    emiratesId: payload.emiratesID,
    email: payload.email,
    phone: payload.mobile,
    userType: UserType.Tenant,
  };

  const result = await prisma.$transaction(async (prisma) => {
    let tenantId;

    const isTenantExists = await prisma.tenant.findFirst({
      where: { email: payload.email },
    });

    if (!isTenantExists) {
      // create User
      const createUser = await prisma.user.create({
        data: userData,
      });

      if (!createUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create User");
      }

      // update user
      const updateUser = await prisma.user.update({
        where: { id: createUser.id },
        data: {
          isProfileSetUp: true,
          userType: UserType.Tenant,
        },
      });

      if (!updateUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update User");
      }

      // create tenant
      const createTenant = await prisma.tenant.create({
        data: { ...tenantData, userId: createUser.id },
      });

      if (!createTenant) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create Tenant");
      }

      tenantId = createTenant.id;
    } else {
      tenantId = isTenantExists.id;
    }

    // create contract
    const createContract = await prisma.contract.create({
      data: { ...payload, tenantId: tenantId },
    });

    if (!createContract) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Faild to create Contract");
    }

    // update property
    const contractExpiresAt = new Date();
    contractExpiresAt.setDate(contractExpiresAt.getDate() + 100);

    const updateProperty = await prisma.property.update({
      where: { id: payload.propertyId },
      data: {
        isContractCreated: true,
        contractExpiresAt,
      },
    });
    
    return createContract;
  });

  return result;
};

const getContractsFromDb = async () => {
  const result = await prisma.contract.findMany({
    include: { property: true },
  });

  return result;
};

const getMyContracts = async (userId: string) => {
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
