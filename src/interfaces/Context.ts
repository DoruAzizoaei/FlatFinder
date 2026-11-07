import { User } from "firebase/auth";
import { IUser } from "./UsersInterfaces";

export interface IAuthContext{
    user: User | null;
    users?: IUser[];
    isLoading: boolean;
    logout: ()=> Promise<void>
}

export interface IFirestoreUserContext{
    firestoreUser: IUser | null;
    isFetching: boolean;
    refreshUser: () => Promise<void>;
   
}

