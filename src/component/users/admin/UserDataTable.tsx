import React, { JSX, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useAuth } from "../../../context/AuthContext";

import {
  deleteUserFromFirestore,
  getAllFirestoreUsers,
} from "../../../utils/function";

import { IUser } from "../../../interfaces/UsersInterfaces";

import { getFlatsByUserId } from "../../../utils/Flat";

import styles from "../styles/styles.module.css";

const UserDataTable: React.FC = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { isLoading } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = (id: string) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setSelectedUserId(null);
    setOpenDialog(false);
  };

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "displayName", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "userRole", headerName: "Role", width: 250 },
    {
      field: "flatCount",
      headerName: "Flats",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate(`/myFlats/${params.id}`)}
          sx={{ textTransform: "none" }}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => navigate(`/users/${params.id}`)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleOpenDialog(params.id.toString())}
          showInMenu={false}
        />,
      ],
    },
  ];

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUserFromFirestore(selectedUserId);
      setAllUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllFirestoreUsers();
        try {
          const usersWithFlats = await Promise.all(
            usersData.map(async (user) => {
              const flats = await getFlatsByUserId(user.id);
              return { ...user, flatCount: flats.length };
            })
          );
          setAllUsers(usersWithFlats);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Box className={styles["userDataContainer"]}>
        <DataGrid
          rows={allUsers}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          sx={{ border: 0 }}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user and all their flats?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDataTable;
