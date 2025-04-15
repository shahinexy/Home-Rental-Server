export type TTenant = {
  fullName: string;
  emiratesId: string;
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
