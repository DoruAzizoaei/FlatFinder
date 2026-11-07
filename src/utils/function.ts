import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { IUser } from "../interfaces/UsersInterfaces";
import { db } from "../services/firebase";
import { deleteFlat } from "./Flat";

export const getUserFromFirestore = async (
  userId: string
): Promise<IUser | undefined> => {
  const querySnapshot = await getDoc(doc(db, "users", userId));
  if (querySnapshot.exists()) {
    return querySnapshot.data() as IUser;
  }
  return undefined;
};

export const getAllFirestoreUsers = async () => {
  const users: IUser[] = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => users.push(doc.data() as IUser));
  return users;
};

const deleteUserFlats = async (userId: string) => {
  const flatsRef = collection(db, "flats");
  const q = query(flatsRef, where("ownerId", "==", userId));
  const snapshot = await getDocs(q);

  console.log(`Found ${snapshot.size} flats for user ${userId}`);
  await Promise.all(snapshot.docs.map((docSnap) => deleteFlat(docSnap.id)));
  console.log(`Found ${snapshot.size} flats for user ${userId}`);
};

export const deleteUserFromFirestore = async (userId: string) => {
  try {
    await deleteUserFlats(userId);
    await deleteDoc(doc(db, "users", userId));
    console.log(`User ${userId} and all associated flats deleted.`);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};
