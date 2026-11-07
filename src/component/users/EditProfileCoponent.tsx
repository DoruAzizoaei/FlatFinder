import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../../services/firebase";

import { useAuth } from "../../context/AuthContext";
import { useFirestoreUser } from "../../context/FirestoreUserContext";

import { enqueueSnackbar } from "notistack";

import { IUser } from "../../interfaces/UsersInterfaces";

import { capitalizeName, updateUser, validateUser } from "../../utils/auth";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

import styles from "./styles/styles.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  user: IUser;
  isAdmin: boolean;
};

const EditProfileComponent: React.FC<Props> = ({
  open,
  onClose,
  user,
  isAdmin,
}): JSX.Element => {
  const navigate = useNavigate();
  const { refreshUser } = useFirestoreUser();
  const { logout } = useAuth();
  const [firstName, setFirstName] = useState(capitalizeName(user.firstName));
  const [lastName, setLastName] = useState(capitalizeName(user.lastName));
  const [birthDate, setBirthDate] = useState(dayjs(user.birthDate));

  const [email] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    currentPassword?: string;
  }>({});

  const [message, setMessage] = useState("");

  const handleToggleAdvanced = (checked: boolean) => {
    setShowAdvanced(checked);

    if (!checked) {
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
      setErrors({});
    }
    if (checked) {
      enqueueSnackbar(
        "Changing the password leads to automatic logout for security reasons",
        {
          variant: "warning",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );
    }
  };

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: dayjs(user.birthDate),
  };

  const handleSubmit = async () => {
    setErrors({});
    setMessage("");

    const isUnchanged =
      firstName.trim().toLowerCase() ===
        initialValues.firstName.trim().toLowerCase() &&
      lastName.trim().toLowerCase() ===
        initialValues.lastName.trim().toLowerCase() &&
      birthDate.isSame(initialValues.birthDate, "day") &&
      (!showAdvanced || !newPassword);
    if (isUnchanged) {
      onClose();
      return;
    }

    const validation = validateUser(
      email,
      newPassword,
      confirmNewPassword,
      firstName,
      lastName,
      birthDate.toDate()
    );

    if (!showAdvanced) {
      delete validation.password;
    } else if (!currentPassword) {
      validation.currentPassword = "Current Password is required";
    }

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      const userCurrent = auth.currentUser;
      if (!userCurrent?.email) throw new Error("User not authenticated.");
      if (!isAdmin) {
        if (showAdvanced && newPassword && currentPassword) {
          const credential = EmailAuthProvider.credential(
            userCurrent.email,
            currentPassword
          );
          await reauthenticateWithCredential(userCurrent, credential);
          await updatePassword(userCurrent, newPassword);

          setMessage("Password updated. You will be logged out...");
          setTimeout(async () => {
            await logout();
            navigate("/login");
          }, 2000);
          return;
        }
      }

      await updateUser({
        id: user.id,
        firstName,
        lastName,
        birthDate: birthDate.toDate().getTime(),
        email,
        displayName: `${capitalizeName(firstName)} ${capitalizeName(lastName)}`,
      });
      await refreshUser();
      setMessage("Profile updated successfully.");
      onClose();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const messageError = getFirebaseErrorMessage(error.code);
        setMessage(messageError);
        setErrors({ currentPassword: `invalid password` });
      } else {
        setMessage(`an unknow error occured.`);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles["editModal"]} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6">Edit Profile</Typography>

        <TextField label="Email" value={email} disabled />
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Birth Date"
            value={birthDate}
            onChange={(date) => setBirthDate(date!)}
          />
        </LocalizationProvider>

        {!isAdmin && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdvanced}
                  onChange={(e) => handleToggleAdvanced(e.target.checked)}
                />
              }
              label="Advanced edit (change password)"
            />

            {showAdvanced && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                />
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={Boolean(errors.currentPassword)}
                  helperText={errors.currentPassword}
                  required
                />
              </>
            )}
          </>
        )}

        <Box className={styles["buttonContainer"]}>
          <Button onClick={onClose} className={styles["button"]}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={styles["button"]}>
            Save
          </Button>
        </Box>

        {message && (
          <Typography color={message.startsWith("Error") ? "error" : "primary"}>
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default EditProfileComponent;
