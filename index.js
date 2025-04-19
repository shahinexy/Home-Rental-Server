const { addMonths } = require("date-fns");


const paymentsPerYear = "2";
const amountPerPayment = 3000 / paymentsPerYear;

// const paymentDetails = Array.from({ length: paymentsPerYear }, (_, i) => ({
//   amount: amountPerPayment,
//   dueDate: addMonths("2025-04-01", i ),
//   status: "DUE",
// }));

const paymentDetails = Array.from({ length: paymentsPerYear }).map((_, i) => ({
  amount: amountPerPayment,
  dueDate: addMonths("2025-04-06T00:00:00.000Z", i),
  status: "DUE",
}));

console.log(12 / paymentsPerYear);
console.log(paymentDetails);
