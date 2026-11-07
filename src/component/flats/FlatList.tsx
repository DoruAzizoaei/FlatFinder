import React, { JSX, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

import FlatCard from "./FlatCard";

import {
  IFilter,
  IFlat,
  SortField,
  SortOrder,
} from "../../interfaces/FlatsInterfaces";
import { Role } from "../../interfaces/UsersInterfaces";

import {
  getAllFlats,
  getFavoritesFlats,
  getFlatsByUserId,
} from "../../utils/Flat";
import { filterFlats, sortFlats } from "./filter&sort";

import styles from "./styles/FlatCard.module.css";

type Props = {
  viewType: "home" | "myFlats" | "favorites" | "admin";
  userId?: string;
  userRole?: Role;
};

const FlatsList: React.FC<Props> = ({
  viewType,
  userId,
  userRole,
}): JSX.Element => {
  const [flats, setFlats] = useState<IFlat[] | null>(null);
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<IFilter>({});
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder | "">("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchFlats = async () => {
      let data: IFlat[] = [];
      if (viewType === "home") {
        data = await getAllFlats();
      } else if (viewType === "myFlats" && user) {
        data = await getFlatsByUserId(user.uid);
      } else if (viewType === "favorites" && user) {
        data = await getFavoritesFlats(user.uid);
      } else if (viewType === "admin" && userId) {
        data = await getFlatsByUserId(userId);
      }
      setFlats(data);
      setPage(1);
    };
    if (!isLoading) {
      fetchFlats();
    }
  }, [viewType, user, isLoading, userId]);

  const handleDeleteFlat = (id: string) => {
    setFlats((prev) => prev?.filter((flat) => flat.id !== id) || []);
  };
  const handleUpdateFlat = (updatedFlat: IFlat) => {
    setFlats((prev) =>
      prev
        ? prev.map((flat) => (flat.id === updatedFlat.id ? updatedFlat : flat))
        : []
    );
  };
  const handleUnfavoriteFlat = (id: string) => {
    if (viewType === "favorites") {
      setFlats((prev) => prev?.filter((flat) => flat.id !== id) || []);
    }
  };
  const filteredSortedFlats = useMemo(() => {
    setPage(1);
    if (!flats) return [];
    let result = filterFlats(flats, filter);
    result = sortFlats(
      result,
      sortField === "" ? null : sortField,
      sortOrder === "" ? null : sortOrder
    );
    return result;
  }, [flats, filter, sortField, sortOrder]);

  const paginatedFlats = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSortedFlats.slice(start, start + pageSize);
  }, [filteredSortedFlats, page]);

  const totalPages = Math.ceil(filteredSortedFlats.length / pageSize);
  const resetFiltersAndSort = () => {
    setFilter({});
    setSortField("");
    setSortOrder("");
    setPage(1);
  };

  if (isLoading || flats === null) {
    return <CircularProgress />;
  }

  return (
    <div className={styles["flatListContainer"]}>
      <Box className={styles["filtersContainer"]}>
        <Box className={styles["filterContent"]}>
          <TextField
            label="City"
            value={filter.city || ""}
            onChange={(e) => setFilter((f) => ({ ...f, city: e.target.value }))}
            size="small"
            placeholder="e.g. Bu"
          />

          <TextField
            label="Min Price (€)"
            type="string"
            value={filter.minPrice || ""}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            size="small"
          />

          <TextField
            label="Max Price (€)"
            type="string"
            value={filter.maxPrice || ""}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            size="small"
          />

          <TextField
            label="Min Area (sqm)"
            type="string"
            value={filter.minArea || ""}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                minArea: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            size="small"
          />

          <TextField
            label="Max Area (sqm)"
            type="string"
            value={filter.maxArea || ""}
            onChange={(e) =>
              setFilter((f) => ({
                ...f,
                maxArea: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            size="small"
          />

          <FormControl className={styles["input"]}>
            <InputLabel id="sort-field-label" size="small">
              Sort By
            </InputLabel>
            <Select
              size="small"
              labelId="sort-field-label"
              id="sort-field-select"
              value={sortField}
              label="Sort By"
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={SortField.RentPrice}>Rent Price</MenuItem>
              <MenuItem value={SortField.AreaSize}>Area Size</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={styles["input"]}>
            <InputLabel id="sort-order-label" size="small">
              Order
            </InputLabel>
            <Select
              size="small"
              labelId="sort-order-label"
              id="sort-order-select"
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={SortOrder.Asc}>Ascending</MenuItem>
              <MenuItem value={SortOrder.Desc}>Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className={styles["resetButton"]}>
          <Button onClick={resetFiltersAndSort}>Reset Filters & Sort</Button>
        </Box>
      </Box>

      {isLoading || flats === null ? (
        <CircularProgress />
      ) : filteredSortedFlats.length === 0 ? (
        <div className={styles["noResultsText"]}>
          {viewType === "home"
            ? "No flats available."
            : viewType === "favorites"
            ? "You have no favorite flats."
            : "You haven’t listed any flats yet."}
        </div>
      ) : (
        <>
          <Box className={styles["flatsList"]}>
            {paginatedFlats.map((flat) => (
              <FlatCard
                key={flat.id}
                flat={flat}
                viewType={viewType}
                isAdmin={userRole === Role.admin}
                onDelete={handleDeleteFlat}
                onUpdated={handleUpdateFlat}
                onUnfavorite={handleUnfavoriteFlat}
              />
            ))}
          </Box>

          <Box className={styles["paginationContainer"]}>
            <Button
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>
            <Typography>
              Page {page} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default FlatsList;
