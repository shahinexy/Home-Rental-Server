import { addMonths } from "date-fns";

export const generatePaymentDetails = ({
  paymentsPerYear,
  totalAmount,
  startDate = new Date(),
}: {
  paymentsPerYear: number;
  totalAmount: number;
  startDate?: Date;
}) => {
  const amountPerPayment = totalAmount / paymentsPerYear;

  const paymentDetails = Array.from({ length: paymentsPerYear }).map(
    (_, i) => ({
      amount: amountPerPayment,
      dueDate: addMonths(startDate, i),
    })
  );

  return paymentDetails;
};
