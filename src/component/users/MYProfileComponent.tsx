import React, { JSX, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";

import { useFirestoreUser } from "../../context/FirestoreUserContext";
import { useAuth } from "../../context/AuthContext";

import EditProfileCoponent from "./EditProfileCoponent";

import { getUserFromFirestore } from "../../utils/function";
import { getFavorites, getFlatsByUserId } from "../../utils/Flat";

import { IUser, Role } from "../../interfaces/UsersInterfaces";

import styles from "./styles/styles.module.css";

const MYProfileComponent: React.FC = (): JSX.Element => {
  const { firestoreUser } = useFirestoreUser();
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [flatCount, setFlatCount] = useState<number | null>(null);

  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    const uidToFetch = userId || user?.uid;
    if (!uidToFetch) return;

    const fetchProfileData = async () => {
      try {
        const data = await getUserFromFirestore(uidToFetch);
        if (data) {
          setProfile(data);
          const flats = await getFlatsByUserId(data.id);
          const favorites = await getFavorites(data.id);
          setFlatCount(flats.length);
          setFavCount(favorites.length);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user, firestoreUser]);

  if (loading || !profile) {
    return <CircularProgress />;
  }

  const isOwnProfile = user?.uid === profile.id;
  const isAdmin = firestoreUser?.userRole === Role.admin && !isOwnProfile;
  const birthDate = dayjs(profile?.birthDate).format(`DD.MM.YYYY`);

  return (
    <Box className={styles["profileContainer"]}>
      <Box className={styles["content"]}>
        <Typography>Name: {profile.displayName} </Typography>
        <Typography>Email: {profile.email}</Typography>
        <Typography>Birth Day: {birthDate}</Typography>
        <Typography>
          My Flats: <Link to={`/myFlats/${profile.id}`}>{flatCount}</Link>{" "}
        </Typography>
        <Typography>Favorite: {favCount}</Typography>

        {(isOwnProfile || isAdmin) && (
          <Box className={styles["buttonContainer"]}>
            <Button
              onClick={() => setOpenModal(true)}
              className={styles["button"]}
            >
              Edit Profile
            </Button>
            <Button className={styles["button"]}>Delete Profile</Button>
          </Box>
        )}
      </Box>
      <EditProfileCoponent
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={profile}
        isAdmin={isAdmin}
      />
    </Box>
  );
};

export default MYProfileComponent;
