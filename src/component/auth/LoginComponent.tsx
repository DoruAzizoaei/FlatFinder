import React, { JSX, useState } from "react";

import { Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

import { login } from "../../utils/auth";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

import styles from "./styles/atuh.module.css";

const LoginComponent: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        const message = getFirebaseErrorMessage(error.code);
        setErrorMessage(message);
        
      } else {
        setErrorMessage("An unknown error occurred.");
        
      }
    }
  };
  return (
    <div className={styles["authContainer"]}>
      <TextField
        id="email"
        label="Email"
        variant="standard"
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
      />
      <TextField
        id="password"
        type="Password"
        label="Password"
        variant="standard"
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
      />
      <Button variant="contained" endIcon={<SendIcon />} onClick={handleLogin}>
        Login
      </Button>
      <Typography>
        {" "}
        Don't have a account? <Link to="/register">Register</Link>
      </Typography>
    </div>
  );
};

export default LoginComponent;
