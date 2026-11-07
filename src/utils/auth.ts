import { FirebaseError } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, updateDoc } from "firebase/firestore";

import { IUser } from "../interfaces/UsersInterfaces";

import { auth, db } from "../services/firebase";

export const register = async (user: IUser, password: string) => {
  try {
    const data = await createUserWithEmailAndPassword(
      auth,
      user.email,
      password
    );
    const fullName = `${capitalizeName(user.firstName)} ${capitalizeName(
      user.lastName
    )}`;
    await updateProfile(data.user, {
      displayName: fullName,
    });

    const createdAtString = data.user.metadata.creationTime;
    const lastLoginAtString = data.user.metadata.lastSignInTime;

    const createdAt = new Date(createdAtString!).getTime();
    const lastLoginAt = new Date(lastLoginAtString!).getTime();

    const userDate: IUser = {
      ...user,
      id: data.user.uid,
      displayName: fullName,
      createdAt: createdAt,
      lastLoginAt: lastLoginAt,
    };
    await setDoc(doc(db, "users", userDate.id), userDate);
  } catch (error) {
    if (error instanceof FirebaseError) throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw  error;
    }
  }
};

export const regex = {
  numberLetters: /^\d+\s?[a-zA-Z]?$/,
  streetName: /^(?!\d+$)[A-Za-z0-9\s]*$/,
  numbers: /^[0-9]*$/,
  letters: /^[A-Za-z]{2,30}(?: [A-Za-z]+)*$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
  imageUrl: /^(http|https):\/\/[^ "]+$/,
};

const calculateAge = (birthDate: Date): number | undefined => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age < 18 || age > 120) {
    return;
  }
  return age;
};

export const validateUser = (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  birthDate: Date
) => {
  const errors: { [key: string]: string } = {};

  if (!email || !regex.email.test(email.trim())) {
    errors.email = "A valid email is required.";
  }
  if (!password || !regex.password.test(password.trim())) {
    errors.password =
      "Password must be at least 6 characters, contain a number and a special character.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = `Password does not match`;
  }
  if (!firstName || !regex.letters.test(firstName.trim())) {
    errors.firstName = "First Name is required.";
  }
  if (!lastName || !regex.letters.test(lastName.trim())) {
    errors.lastName = "Last Name is required.";
  }
  if (!birthDate || !calculateAge(birthDate)) {
    errors.birthDate = "You must be at least 18 years old.";
  }

  return errors;
};

export const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join(" ");
  return initials;
};

export const capitalizeName = (name: string): string =>
  name
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .toLowerCase()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const updateUser = async (
  updatedUser: Partial<IUser> & { id: string }
) => {
  try {
    const userRef = doc(db, "users", updatedUser.id);
    await updateDoc(userRef, updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
