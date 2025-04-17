export type TMaintenance = {
  title: string;
  priority: "Urgent" | "Medium" | "Low";
  date: Date;
  time: string;
  image: string;
  description: string;
  tenantId: string;
  propertyId: string;
};
