export type TTenant = {
  fullName: string;
  emiratesId: string;
  email: string;
  phone: string;
  userType?: "Landlord" | "Agency" | "Tenant";
  userId: string;
};
