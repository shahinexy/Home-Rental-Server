"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysUntilExpiration = void 0;
const date_fns_1 = require("date-fns");
const getDaysUntilExpiration = (date) => {
    if (!date)
        return null;
    const today = new Date();
    const days = (0, date_fns_1.differenceInDays)(date, today);
    return days < 0 ? 0 : days;
};
exports.getDaysUntilExpiration = getDaysUntilExpiration;
