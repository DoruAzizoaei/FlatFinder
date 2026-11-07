import React, {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { IFirestoreUserContext } from "../interfaces/Context";
import { useAuth } from "./AuthContext";
import { IUser } from "../interfaces/UsersInterfaces";
import { getUserFromFirestore } from "../utils/function";

const FirestoreUserContext = createContext<IFirestoreUserContext | undefined>(
  undefined
);

export const FirestoreUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}): JSX.Element => {
  const { user } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState<IUser | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchUser = async () => {
    if (!user) {
      return;
    }
    setIsFetching(true);
    try {
      const fetchedUser = await getUserFromFirestore(user.uid);
      if (fetchedUser) {
        setFirestoreUser(fetchedUser);
      }
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  return (
    <FirestoreUserContext.Provider
      value={{ firestoreUser, isFetching, refreshUser: fetchUser }}
    >
      {children}
    </FirestoreUserContext.Provider>
  );
};

export const useFirestoreUser = () => {
  const context = useContext(FirestoreUserContext);
  if (!context) {
    throw new Error(
      "useFirestoreUser must be used within FirestoreUserProvider"
    );
  }
  return context;
};
