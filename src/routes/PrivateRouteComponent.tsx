import React, { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "../context/AuthContext";

import NavbarComponent from "../component/navBar/NavBarComponent";
import Footer from "../component/footer/FooterComponent";

import styles from "./styles/style.module.css";

const PrivateRoute: React.FC = (): JSX.Element => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <CircularProgress />;
  }
  return isLoading ? (
    <CircularProgress />
  ) : user?.uid ? (
    <Box className={styles["container-app"]}>
      <NavbarComponent user={user} />
      <Box className={styles["content"]}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
