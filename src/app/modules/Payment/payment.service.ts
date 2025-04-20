import prisma from "../../../shared/prisma";

const getPropertyPayments = async (propertyId: string) => {
  const result = await prisma.payment.findFirst({
    where: { propertyId },
    include: { paymentDetails: true },
  });
  return result;
};

const updatePaymentStatus = async (id: string) => {
  const result = await prisma.paymentDetail.update({
    where: { id },
    data: { status: "Paid" },
  });
  return result;
};

export const PaymentService = {
  getPropertyPayments,
  updatePaymentStatus,
};
