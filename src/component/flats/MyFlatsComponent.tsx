import React, { JSX } from "react";

import { useParams } from "react-router-dom";

import { useFirestoreUser } from "../../context/FirestoreUserContext";

import { Role } from "../../interfaces/UsersInterfaces";

import FlatsList from "./FlatList";


const MyFlatsComponent: React.FC = (): JSX.Element => {
  const { firestoreUser } = useFirestoreUser();

  const { userId } = useParams<{ userId: string }>();
  const isAdmin = firestoreUser?.userRole === Role.admin;
  return (
    <FlatsList
      viewType={isAdmin && userId ? "admin" : "myFlats"}
      userRole={firestoreUser?.userRole}
      userId={userId}
    />
  );
};

export default MyFlatsComponent;
