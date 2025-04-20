import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TContract } from "./contract.interface";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";
import { generatePaymentDetails } from "./contract.utils";

const createContractIntoDb = async (payload: TContract, userId: string) => {
  const isUserExits = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get user profile based on user type (Landlord or Agency)
  let profileId: string | undefined;
  let isLandlord = false;
  let isAgency = false;

  if (isUserExits.userType === "Landlord") {
    const isLandloardExists = await prisma.landlord.findFirst({
      where: { userId },
    });

    if (!isLandloardExists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Setup your profile as landlord"
      );
    }

    profileId = isLandloardExists.id;
    isLandlord = true;
  } else if (isUserExits.userType === "Agency") {
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
    isAgency = true;
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  // Fetch the property and ensure it's created by the correct profile
  const isPropertyExists = await prisma.property.findFirst({
    where: { id: payload.propertyId },
  });

  if (!isPropertyExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (isLandlord && isPropertyExists.landlordId !== profileId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized access for Landlord"
    );
  }

  if (isAgency && isPropertyExists.agencyId !== profileId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized access for Agency"
    );
  }

  // Check if a contract already exists for this property
  const isContractAlreadyExists = await prisma.contract.findFirst({
    where: { propertyId: payload.propertyId, isDeleted: false },
  });

  if (isContractAlreadyExists) {
    throw new ApiError(httpStatus.CONFLICT, "Property contract already exists");
  }

  // Create contract logic
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

  const startDate = new Date(payload.startDate).toISOString();
  const endDate = new Date(payload.endDate).toISOString();

  // =========== Start transaction ==========
  const result = await prisma.$transaction(async (prisma) => {
    let tenantId;

    const isTenantExists = await prisma.tenant.findFirst({
      where: { email: payload.email },
    });

    if (!isTenantExists) {
      // Create User
      const createUser = await prisma.user.create({
        data: userData,
      });

      if (!createUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create User");
      }

      // Update User
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

      // Create Tenant
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

    // Create Contract
    const createContract = await prisma.contract.create({
      data: { ...payload, tenantId: tenantId, startDate, endDate },
    });

    if (!createContract) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create Contract");
    }

    // create contract payment details
    const paymentDetails = generatePaymentDetails({
      paymentsPerYear: payload.numberPayments,
      totalAmount: payload.totalRent,
      startDate: payload.startDate,
    });

    const createPaymentDetails = await prisma.payment.create({
      data: {
        paymentDetails: { create: paymentDetails },
        propertyId: payload.propertyId,
      },
    });

    // Update Property with contract expiry
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
    where: { isDeleted: false },
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

  const result = await prisma.contract.findMany({
    where: { tenantId: isTenantExists.id, isDeleted: false },
    include: { property: true },
  });

  return result;
};

const getSingleContract = async (id: string) => {
  const result = await prisma.contract.findFirst({
    where: { id, isDeleted: false },
    include: { property: true },
  });

  return result;
};

const getPropertyContract = async (id: string) => {
  const result = await prisma.contract.findFirst({
    where: { propertyId: id, isDeleted: false },
    include: { property: true },
  });

  return result;
};

const deleteContract = async (id: string, userId: string) => {
  const isContractExists = await prisma.contract.findFirst({
    where: { id },
  });

  if (!isContractExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contract not found");
  }

  const isUserExits = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExits) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const getProperty = await prisma.property.findFirst({
    where: { id: isContractExists.propertyId },
  });

  if (!getProperty) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (isUserExits.userType === "Landlord") {
    const isLandloardExists = await prisma.landlord.findFirst({
      where: { userId },
    });

    if (!isLandloardExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Landlord not found");
    }

    if (getProperty.landlordId !== isLandloardExists.id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "This is not you property contract"
      );
    }
  } else if (isUserExits.userType === "Agency") {
    const isAgencyExists = await prisma.agency.findFirst({
      where: { userId },
    });

    if (!isAgencyExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
    }

    if (getProperty?.agencyId !== isAgencyExists?.id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "This is not you property contract"
      );
    }
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  const result = await prisma.contract.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Contract deleted successfully" };
};

export const ContractServices = {
  createContractIntoDb,
  getContractsFromDb,
  getMyContracts,
  getSingleContract,
  getPropertyContract,
  deleteContract,
};
