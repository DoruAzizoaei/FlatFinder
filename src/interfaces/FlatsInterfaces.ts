
interface IFlat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number  | null;
  rentPrice: number;
  dateAvailable: Date  | null;
  id: string;
  ownerId: string;
  createdAt?: number;
  imageUrls: string[];
}

interface IFilter  {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
};

export enum SortField {
  RentPrice = "rentPrice",
  AreaSize = "areaSize",
}

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
  
}


export type { IFlat , IFilter};

