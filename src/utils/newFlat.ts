import { addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { IFlat } from "../interfaces/FlatsInterfaces";
import { regex } from "./auth";

export const createNewFlat = async (flat: IFlat, ownerId: string) => {
  try {
    const docRef = await addDoc(collection(db, "flats"), {
      ...flat,
      ownerId,
    });
    const flatData: IFlat = {
      ...flat,
      id: docRef.id,
      ownerId,
    };
    await setDoc(docRef, flatData);
  } catch (error) {
    console.log(error);
  }
};

export const validateFlat = (
  flat: Partial<IFlat>,
  initialDateAvailable?: Date
) => {
  const errors: { [key: string]: string } = {};
  if (!flat.city || !regex.letters.test(flat.city.trim())) {
    errors.city = "Invalid city";
  }
  if (!flat.streetName || !regex.streetName.test(flat.streetName.trim())) {
    errors.streetName = "Invalid Street Name";
  }
  if (
    !flat.streetNumber ||
    !regex.numberLetters.test(String(flat.streetNumber))
  ) {
    errors.streetNumber = "Invalid Street Number";
  }
  if (!flat.areaSize || !regex.numbers.test(String(flat.areaSize))) {
    errors.areaSize = "Invalid area size";
  }
  if (!flat.yearBuilt || flat.yearBuilt < 1900) {
    errors.yearBuilt = "Invalid year built";
  }
  if (!flat.rentPrice || !regex.numbers.test(String(flat.rentPrice))) {
    errors.rentPrice = "Invalide price";
  }
  if (!flat.dateAvailable) {
    errors.dateAvailable = "Invalid date available";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const initDate = initialDateAvailable
      ? new Date(initialDateAvailable)
      : null;
    if (initDate) initDate.setHours(0, 0, 0, 0);

    let minDate = today;
    if (initDate && initDate < today) {
      minDate = initDate;
    }

    const availableDate = new Date(flat.dateAvailable);
    availableDate.setHours(0, 0, 0, 0);

    if (availableDate < minDate) {
      errors.dateAvailable = `Date available cannot be earlier than ${minDate.toLocaleDateString()}`;
    }
  }

  if (flat.imageUrls) {
    flat.imageUrls.forEach((url, index) => {
      if (!regex.imageUrl.test(url)) {
        errors[`imageUrls${index}`] = `Image URL ${index + 1} is invalid`;
      }
    });
  }

  return errors;
};
