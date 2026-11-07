import { IFilter, IFlat, SortField, SortOrder } from "../../interfaces/FlatsInterfaces";

export function filterFlats(flats: IFlat[], filter: IFilter): IFlat[] {
  let result = flats;

  if (filter.city) {
    result = result.filter((flat) =>
      flat.city.toLowerCase().startsWith(filter.city!.toLowerCase())
    );
  }

  if (filter.minPrice !== undefined) {
    result = result.filter((flat) => flat.rentPrice >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    result = result.filter((flat) => flat.rentPrice <= filter.maxPrice!);
  }

  if (filter.minArea !== undefined) {
    result = result.filter((flat) => flat.areaSize >= filter.minArea!);
  }

  if (filter.maxArea !== undefined) {
    result = result.filter((flat) => flat.areaSize <= filter.maxArea!);
  }

  return result;
}
export function sortFlats(
  flats: IFlat[],
  field: SortField | null,
  order: SortOrder | null
): IFlat[] {
  if (!field || !order) return flats;

  const sorted = [...flats];
  sorted.sort((a, b) => {
    if (a[field] < b[field]) return order === "asc" ? -1 : 1;
    if (a[field] > b[field]) return order === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}