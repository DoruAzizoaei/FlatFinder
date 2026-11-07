import React, { JSX, useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import { useAuth } from "../../context/AuthContext";

import EditFlatComponent from "./EditFlatComponent";

import noImg from "../../assets/noImg.png";

import { IFlat } from "../../interfaces/FlatsInterfaces";

import {
  addFavorite,
  deleteFlat,
  getFavorites,
  removeFavorite,
} from "../../utils/Flat";
import { capitalizeName } from "../../utils/auth";

import styles from "./styles/FlatCard.module.css";

type Props = {
  flat: IFlat;
  viewType: "home" | "myFlats" | "favorites" | "admin";
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdated: (flat: IFlat) => void;
  onUnfavorite?: (id: string) => void;
};

const FlatCard: React.FC<Props> = ({
  flat,
  viewType,
  onDelete,
  onUpdated,
  onUnfavorite,
  isAdmin,
}): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [flatId, setFlatId] = useState<string>("");

  const handleOpenModal = (id: string) => {
    setFlatId(id);
    setOpenEditModal(true);
  };
  const handleCloseModal = () => {
    setOpenEditModal(false);
    setFlatId("");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmDeleteClose = () => setOpenConfirmDelete(false);
  const handleOpenConfirmDelete = () => setOpenConfirmDelete(true);

  const { user } = useAuth();

  const images =
    flat.imageUrls && flat.imageUrls.length > 0 ? flat.imageUrls : [noImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const year = flat.yearBuilt ? dayjs(flat.yearBuilt).format("YYYY") : "-";
  const availableDate = flat.dateAvailable
    ? dayjs(flat.dateAvailable).format("DD-MM-YYYY")
    : "-";

  useEffect(() => {
    const checkFavorite = async () => {
      if (user) {
        const favs = await getFavorites(user?.uid);
        setIsFavorite(favs.includes(flat.id));
      }
    };
    checkFavorite();
  }, [user, flat.id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      return;
    }
    if (isFavorite) {
      await removeFavorite(user.uid, flat.id);
      enqueueSnackbar("The flat has been removed from favorites!", {
        variant: "info",
        autoHideDuration: 1500,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      if (viewType === "favorites" && onUnfavorite) {
        onUnfavorite(flat.id);
      }
    } else {
      await addFavorite(user.uid, flat.id);
      enqueueSnackbar("The flat has been added to favorites!", {
        variant: "success",
        autoHideDuration: 1500,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
    setIsFavorite((prev) => !prev);
  };
  const handleDelete = async () => {
    if (!user) {
      return;
    }

    await deleteFlat(flat.id);
    if (onDelete) {
      onDelete(flat.id);
    }
    enqueueSnackbar("The flat has been deleted successfully!", {
      variant: "success",
      autoHideDuration: 1500,
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
    handleConfirmDeleteClose();
  };

  const navigate = useNavigate();

  const startChat = async (ownerId: string, flatId: string) => {
    if (!user) return;

    const chatId =
      user.uid < ownerId
        ? `${user.uid}_${ownerId}_${flatId}`
        : `${ownerId}_${user.uid}_${flatId}`;

    navigate(`/inbox/${chatId}`);
  };

  return (
    <>
      <Card className={styles["flatCard"]}>
        <CardActionArea onClick={handleOpen}>
          <CardMedia
            className={styles["media"]}
            component="img"
            image={images.length > 0 ? images[0] : noImg}
            alt="Apartment"
          />
          <CardContent className={styles["content"]}>
            <Typography variant="h6" component="div" className={styles["info"]}>
              {capitalizeName(flat.city)} - {capitalizeName(flat.streetName)} -{" "}
              {flat.streetNumber}
            </Typography>
            <Typography className={styles["info"]}>
              {flat.areaSize} sqm • AC: {flat.hasAC ? "Yes" : "No"} •
              {flat.rentPrice} €
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={styles["actions"]}>
          <IconButton
            aria-label="add to favorites"
            color="primary"
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>

          {(viewType === "myFlats" || isAdmin) && (
            <CardActions>
              <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => handleOpenModal(flat.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={handleOpenConfirmDelete}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={openConfirmDelete}
        onClose={handleConfirmDeleteClose}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          Are you sure you want to delete this flat?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={open} onClose={handleClose}>
        <Box className={styles["cardModal"]}>
          <Typography variant="h6" gutterBottom>
            {capitalizeName(flat.city)}, {capitalizeName(flat.streetName)}{" "}
            {flat.streetNumber}
            <IconButton
              aria-label="add to favorites"
              color="primary"
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (user && flat.ownerId !== user.uid) {
                  startChat(flat.ownerId, flat.id);
                }
              }}
            >
              Send message
            </Button>
          </Typography>
          <CardMedia
            className={styles["cardMedia"]}
            component="img"
            height="200"
            image={images[currentImageIndex]}
            alt={`Apartment image ${currentImageIndex + 1}`}
          />
          <Box className={styles["cardPagination"]}>
            <Button
              size="small"
              disabled={currentImageIndex === 0}
              onClick={() => setCurrentImageIndex((prev) => prev - 1)}
            >
              ←
            </Button>
            <Typography variant="body2">
              Image {currentImageIndex + 1} of {images.length}
            </Typography>
            <Button
              size="small"
              disabled={currentImageIndex === images.length - 1}
              onClick={() => setCurrentImageIndex((prev) => prev + 1)}
            >
              →
            </Button>
          </Box>
          <Box className={styles["cardContent"]}>
            <Typography>🏙️ City: {capitalizeName(flat.city)}</Typography>
            <Typography>
              📍 Street: {capitalizeName(flat.streetName)} - {flat.streetNumber}
            </Typography>
            <Typography> 📐 Area: {flat.areaSize} m²</Typography>
            <Typography> ❄️ AC: {flat.hasAC ? "Yes" : "No"}</Typography>
            <Typography>🏗️ Year built: {year}</Typography>
            <Typography>💸 Rent: {flat.rentPrice} €</Typography>
            <Typography>📅 Available: {availableDate} </Typography>
          </Box>
        </Box>
      </Modal>
      {flatId === flat.id && (
        <EditFlatComponent
          flatId={flatId}
          open={openEditModal}
          onClose={handleCloseModal}
          onSave={(updatedFlat) => {
            onUpdated(updatedFlat);
          }}
        />
      )}
    </>
  );
};

export default FlatCard;
