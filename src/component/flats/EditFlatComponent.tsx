import React, { JSX, useState, useEffect } from "react";

import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";

import MaterialUISwitch from "./MaterialUISwitch";

import { IFlat } from "../../interfaces/FlatsInterfaces";

import { getFlatById, updateFlat } from "../../utils/Flat";
import { validateFlat } from "../../utils/newFlat";
import { capitalizeName } from "../../utils/auth";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface EditFlatProps {
  flatId: string;
  open: boolean;
  onClose: () => void;
  onSave: (updatedFlat: IFlat) => void;
}

const EditFlatComponent: React.FC<EditFlatProps> = ({
  flatId,
  open,
  onClose,
  onSave,
}): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const [flatData, setFlatData] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAce: false,
    yearBuilt: null as Dayjs | null,
    rentPrice: "",
    dateAvailable: null as Dayjs | null,
    imageUrls: [""],
    ownerId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [initialDateAvailable, setInitialDateAvailable] =
    useState<Dayjs | null>(null);

  useEffect(() => {
    if (open) {
      const fetchFlatData = async () => {
        try {
          const flat = await getFlatById(flatId);
          if (flat) {
            setFlatData({
              city: capitalizeName(flat.city),
              streetName: capitalizeName(flat.streetName),
              streetNumber: String(flat.streetNumber),
              areaSize: String(flat.areaSize),
              hasAce: flat.hasAC,
              yearBuilt: flat.yearBuilt ? dayjs(flat.yearBuilt) : null,
              rentPrice: String(flat.rentPrice),
              dateAvailable: flat.dateAvailable
                ? dayjs(flat.dateAvailable)
                : null,
              imageUrls: flat.imageUrls,
              ownerId: flat.ownerId,
            });
            setInitialDateAvailable(flatData.dateAvailable);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchFlatData();
    }
  }, [flatId, open]);

  const handleEditFlat = async () => {
    setErrors({});
    const updatedFlat: IFlat = {
      id: flatId,
      city: flatData.city,
      streetName: flatData.streetName,
      streetNumber: Number(flatData.streetNumber),
      areaSize: Number(flatData.areaSize),
      hasAC: flatData.hasAce,
      yearBuilt: flatData.yearBuilt ? flatData.yearBuilt.year() : null,
      rentPrice: Number(flatData.rentPrice),
      dateAvailable: flatData.dateAvailable
        ? flatData.dateAvailable.toDate()
        : null,
      imageUrls: flatData.imageUrls,
      createdAt: Date.now(),
      ownerId: flatData.ownerId,
    };
    const validationErrors = validateFlat(updatedFlat);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await updateFlat(updatedFlat);
      enqueueSnackbar("The flat has been updated successfully!", {
        variant: "success",
        autoHideDuration: 1500,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      onSave(updatedFlat);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit Flat Details
        </Typography>

        <TextField
          label="City"
          variant="standard"
          fullWidth
          value={flatData.city}
          onChange={(e) => setFlatData({ ...flatData, city: e.target.value })}
          error={Boolean(errors.city)}
          helperText={errors.city}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Street Name"
          variant="standard"
          fullWidth
          value={flatData.streetName}
          onChange={(e) =>
            setFlatData({ ...flatData, streetName: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          label="Street Number"
          variant="standard"
          fullWidth
          value={flatData.streetNumber}
          onChange={(e) =>
            setFlatData({ ...flatData, streetNumber: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          label="Area Size"
          variant="standard"
          fullWidth
          value={flatData.areaSize}
          onChange={(e) =>
            setFlatData({ ...flatData, areaSize: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <MaterialUISwitch
              checked={flatData.hasAce}
              onChange={(e) =>
                setFlatData({ ...flatData, hasAce: e.target.checked })
              }
            />
          }
          label="Has AC"
          sx={{ mb: 2 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Year Built"
              disableFuture
              views={["year"]}
              openTo="year"
              format="YYYY"
              value={flatData.yearBuilt}
              onChange={(e) =>
                setFlatData({ ...flatData, yearBuilt: e ? dayjs(e) : null })
              }
            />
          </DemoContainer>
        </LocalizationProvider>

        <TextField
          label="Rent Price"
          variant="standard"
          fullWidth
          value={flatData.rentPrice}
          onChange={(e) =>
            setFlatData({ ...flatData, rentPrice: e.target.value })
          }
          sx={{ mb: 2, mt: 2 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date Available"
              format="DD-MM-YYYY"
              disablePast
              minDate={
                initialDateAvailable && initialDateAvailable.isAfter(dayjs())
                  ? dayjs().startOf("day")
                  : initialDateAvailable ?? dayjs().startOf("day")
              }
              value={flatData.dateAvailable}
              onChange={(e) =>
                setFlatData({
                  ...flatData,
                  dateAvailable: e ? dayjs(e) : null,
                })
              }
            />
          </DemoContainer>
        </LocalizationProvider>

        {/* Image fields */}
        {flatData.imageUrls.map((url, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <TextField
              label={`Image URL ${index + 1}`}
              variant="standard"
              value={url}
              onChange={(e) => {
                const newUrls = [...flatData.imageUrls];
                newUrls[index] = e.target.value;
                setFlatData({ ...flatData, imageUrls: newUrls });
              }}
              fullWidth
              sx={{ mr: 1 }}
            />
            <Button
              onClick={() =>
                setFlatData({
                  ...flatData,
                  imageUrls: flatData.imageUrls.filter((_, i) => i !== index),
                })
              }
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </Box>
        ))}

        <Button
          onClick={() =>
            setFlatData({ ...flatData, imageUrls: [...flatData.imageUrls, ""] })
          }
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add image
        </Button>

        {/* Action buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button onClick={onClose} variant="outlined" color="secondary">
            Close
          </Button>
          <Button onClick={handleEditFlat} variant="contained" color="primary">
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditFlatComponent;
