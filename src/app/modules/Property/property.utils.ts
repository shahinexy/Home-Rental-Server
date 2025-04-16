import { differenceInDays } from "date-fns";

export const getDaysUntilExpiration = (date: Date | null): number | null => {
  if (!date) return null;
  const today = new Date();
  const days = differenceInDays(date, today);
  return days < 0 ? 0 : days;
};
