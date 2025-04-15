export type TAgency = {
  companyName: string;
  email: string;
  phone: string;
  uerType: "Agency" | "Landlord" | "Tenant";
  userId: string;
};

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
