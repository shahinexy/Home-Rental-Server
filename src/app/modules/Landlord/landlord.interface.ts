export type TLandlord = {
  fullName: string;
  emiratesIdOrPassport: string;
  email: string;
  phone: string;
  uerType?: "Landlord" | "Agency" | "Tenant";
  userId: string;
};

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
