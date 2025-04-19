"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentDetails = void 0;
const date_fns_1 = require("date-fns");
const generatePaymentDetails = ({ paymentsPerYear, totalAmount, startDate = new Date(), }) => {
    const amountPerPayment = totalAmount / paymentsPerYear;
    const paymentDetails = Array.from({ length: paymentsPerYear }).map((_, i) => ({
        amount: amountPerPayment,
        dueDate: (0, date_fns_1.addMonths)(startDate, i),
        status: "DUE",
    }));
    return paymentDetails;
};
exports.generatePaymentDetails = generatePaymentDetails;
