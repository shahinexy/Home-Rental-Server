export type TLandlord = {
  fullName: string;
  emiratesIdOrPassport: string;
  email: string;
  phone: string;
  userType?: "Landlord" | "Agency" | "Tenant";
  userId: string;
};
