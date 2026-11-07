import React, { JSX } from "react";

import { SnackbarProvider } from "notistack";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AppRoutesComponent from "./routes/AppRoutesComponent";

const App: React.FC = (): JSX.Element => {
  return (
    <>
      <AuthProvider>
        <SnackbarProvider>
          <AppRoutesComponent />
        </SnackbarProvider>
      </AuthProvider>
    </>
  );
};

export default App;
