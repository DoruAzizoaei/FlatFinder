import React, { JSX } from "react";

import UserDataTable from "./UserDataTable";
import { useFirestoreUser } from "../../../context/FirestoreUserContext";
import { Role } from "../../../interfaces/UsersInterfaces";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const AdminPageComponent: React.FC = (): JSX.Element => {
  const { firestoreUser } = useFirestoreUser();
 const navigate = useNavigate();


  if (firestoreUser?.userRole !== Role.admin || !firestoreUser) {
    navigate("/");
    return <CircularProgress />;
  }

  return (
    <>
      <UserDataTable />
    </>
  );
};

export default AdminPageComponent;
