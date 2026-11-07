import dayjs from "dayjs";

import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { IFlat } from "../interfaces/FlatsInterfaces";
import { db } from "../services/firebase";

export const getAllFlats = async (): Promise<IFlat[]> => {
  const flatsRef = collection(db, "flats");
  const snapshot = await getDocs(flatsRef);

  return snapshot.docs.map((doc) =>
    parseFlatData(doc.data(), doc.id)
  ) as IFlat[];
};

export const getFlatsByUserId = async (userId: string): Promise<IFlat[]> => {
  const flatsRef = collection(db, "flats");
  const q = query(flatsRef, where("ownerId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) =>
    parseFlatData(doc.data(), doc.id)
  ) as IFlat[];
};

const parseFlatData = (data: any, id: string): IFlat => ({
  ...data,
  id,
  yearBuilt: data.yearBuilt
    ? dayjs(data.yearBuilt.toDate ? data.yearBuilt.toDate() : data.yearBuilt)
    : null,
  dateAvailable: data.dateAvailable
    ? dayjs(
        data.dateAvailable.toDate
          ? data.dateAvailable.toDate()
          : data.dateAvailable
      )
    : null,
});

export const addFavorite = async (userId: string, flatId: string) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favorites: arrayUnion(flatId),
  });
};
export const removeFavorite = async (userId: string, flatId: string) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favorites: arrayRemove(flatId),
  });
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.favorites || [];
  }
  return [];
};

export const getFavoritesFlats = async (userId: string): Promise<IFlat[]> => {
  const flatIds = await getFavorites(userId);
  if (flatIds.length === 0) {
    return [];
  }
  const flatsRef = collection(db, "flats");
  const snapshot = await getDocs(flatsRef);
  const allFlats = snapshot.docs.map((doc) =>
    parseFlatData(doc.data(), doc.id)
  );
  return allFlats.filter((flat) => flatIds.includes(flat.id));
};

export const deleteFlat = async (flatId: string) => {
  try {
    const flatRef = doc(db, "flats", flatId);
    await deleteDoc(flatRef);

    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    await Promise.all(
      snapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        if (favorites.includes(flatId)) {
          await removeFavorite(userDoc.id, flatId);
        }
      })
    );
  } catch (error) {
    console.error(`Error deleting flat ${flatId}:`, error);
  }
};

export const updateFlat = async (updatedFlat: IFlat) => {
  const flatRef = doc(db, "flats", updatedFlat.id);
  try {
    await updateDoc(flatRef, {
      city: updatedFlat.city,
      streetName: updatedFlat.streetName,
      streetNumber: updatedFlat.streetNumber,
      areaSize: updatedFlat.areaSize,
      hasAC: updatedFlat.hasAC,
      yearBuilt: updatedFlat.yearBuilt ? updatedFlat.yearBuilt : null,
      rentPrice: updatedFlat.rentPrice,
      dateAvailable: updatedFlat.dateAvailable
        ? updatedFlat.dateAvailable
        : null,
      imageUrls: updatedFlat.imageUrls,
    });
  } catch (error) {
    console.error("Error updating flat: ", error);
  }
};

export const getFlatById = async (flatId: string): Promise<IFlat | null> => {
  try {
    const flatRef = doc(db, "flats", flatId);
    const flatSnap = await getDoc(flatRef);

    if (flatSnap.exists()) {
      const flatData = flatSnap.data();
      return parseFlatData(flatData, flatSnap.id);
    } else {
      console.log("Flat not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting flat by ID: ", error);
    return null;
  }
};

type FilterOptions = {
  city?: string;
  hasAC?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

type SortOption = "priceAsc" | "priceDesc" | "dateNewest" | "dateOldest";

export const filterAndSortFlats = (
  flats: IFlat[],
  filters: FilterOptions = {},
  sortBy?: SortOption
): IFlat[] => {
  let result = [...flats];

  // Filtrare
  if (filters.city) {
    result = result.filter((flat) =>
      flat.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters.hasAC !== undefined) {
    result = result.filter((flat) => flat.hasAC === filters.hasAC);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((flat) => flat.rentPrice >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((flat) => flat.rentPrice <= filters.maxPrice!);
  }

  // Sortare
  if (sortBy === "priceAsc") {
    result.sort((a, b) => a.rentPrice - b.rentPrice);
  } else if (sortBy === "priceDesc") {
    result.sort((a, b) => b.rentPrice - a.rentPrice);
  } else if (sortBy === "dateNewest") {
    result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (sortBy === "dateOldest") {
    result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }

  return result;
};
