import React, { JSX, useState } from "react";

import { Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FirebaseError } from "firebase/app";

import { IUser, Role } from "../../interfaces/UsersInterfaces";

import { register, validateUser } from "../../utils/auth";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

import styles from "./styles/atuh.module.css";

const RegisterComponent: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
  }>({});

  const newUser: IUser = {
    email: email,
    id: "",
    firstName: firstName,
    lastName: lastName,
    birthDate: birthDate ? birthDate.getTime() : 0,
    userRole: Role.user,
    isActive: true,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  const handleRegister = async () => {
    setErrors({});
    const validationErrors = validateUser(
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      birthDate!
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await register(newUser, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);

        const message = getFirebaseErrorMessage(error.code);
        setErrorMessage(message);
        console.log(errorMessage);
      } else {
        setErrorMessage("An unknown error occurred.");
        console.log(errorMessage);
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
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <TextField
        id="password"
        type="password"
        label="Password"
        variant="standard"
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />
      <TextField
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        variant="standard"
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
      />
      <TextField
        id="firstName"
        label="First Name"
        variant="standard"
        onChange={(e) => setFirstName(e.target.value)}
        error={Boolean(errors.firstName)}
        helperText={errors.firstName}
      />
      <TextField
        id="lastName"
        label="Last Name"
        variant="standard"
        onChange={(e) => setLastName(e.target.value)}
        error={Boolean(errors.lastName)}
        helperText={errors.lastName}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            className={styles["dataPiker"]}
            label="Birth day"
            disableFuture
            value={birthDate ? dayjs(birthDate) : null}
            onChange={(e) => setBirthDate(e?.toDate() ?? null)}
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                error: Boolean(errors.birthDate),
                helperText: errors.birthDate,
                variant: "standard",
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleRegister}
      >
        Register
      </Button>

      <Typography>
        You have a account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default RegisterComponent;
