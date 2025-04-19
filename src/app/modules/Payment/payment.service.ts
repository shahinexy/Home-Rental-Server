import prisma from "../../../shared/prisma";

const getPropertyPayments = async (propertyId: string) => {
  const result = await prisma.payment.findFirst({
    where: { propertyId },
    include: { paymentDetails: true},
  });
  return result;
};

export const PaymentService = {
  getPropertyPayments,
};
