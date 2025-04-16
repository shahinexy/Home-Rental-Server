export type TProperty = {
  propertyName: string;
  propertyType: string;
  buildingName: string;
  location: string;
  maknaiNumber: string;
  propertyArea: string;
  totalFloor: number;
  totalRooms: number;
  description: string;
  landlordId: string;
};

export type IPropertyFilterRequest = {
  searchTerm?: string | undefined;
  contractExpiresAt?: string | undefined;
  location?: string | undefined;
};
