import React, { JSX, useState } from "react";

import { Box, Button, FormControlLabel, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";

import MaterialUISwitch from "./MaterialUISwitch";

import { IFlat } from "../../interfaces/FlatsInterfaces";

import { createNewFlat, validateFlat } from "../../utils/newFlat";

import { auth } from "../../services/firebase";

import styles from "./styles/FlatCard.module.css";

const NewFlatComponent: React.FC = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const ownerId = auth.currentUser;
  const [flatData, setFlatData] = useState<{
    city: string;
    streetName: string;
    streetNumber: string;
    areaSize: string;
    hasAce: boolean;
    yearBuilt: Dayjs | null;
    rentPrice: string;
    dateAvailable: Dayjs | null;
    imageUrls: string[];
  }>({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAce: false,
    yearBuilt: null,
    rentPrice: "",
    dateAvailable: null,
    imageUrls: [""],
  });
  const [errors, setErrors] = useState<{
    city?: string;
    streetName?: string;
    streetNumber?: string;
    areaSize?: string;
    yearBuilt?: string;
    rentPrice?: string;
    dateAvailable?: string;
    [key: `imageUrls${number}`]: string | undefined;
  }>({});

  const newFlat: IFlat = {
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
    id: "",
    createdAt: Date.now(),
    ownerId: ownerId?.uid ?? "",
  };
  const handelNewFlat = async () => {
    setErrors({});
    const validationErrors = validateFlat(newFlat);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await createNewFlat(newFlat, newFlat.ownerId);
      setFlatData({
        city: "",
        streetName: "",
        streetNumber: "",
        areaSize: "",
        hasAce: false,
        yearBuilt: null,
        rentPrice: "",
        dateAvailable: null,
        imageUrls: [""],
      });
      enqueueSnackbar("The flat has been added successfully!", {
        variant: "success",
        autoHideDuration: 1500,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles["newFlat"]}>
      <Box className={styles["content"]}>
        <TextField
          id="city"
          label="City"
          variant="standard"
          value={flatData.city}
          onChange={(e) => setFlatData({ ...flatData, city: e.target.value })}
          error={Boolean(errors.city)}
          helperText={errors.city}
        />
        <TextField
          id="streetName"
          label="Street Name"
          variant="standard"
          value={flatData.streetName}
          onChange={(e) =>
            setFlatData({ ...flatData, streetName: e.target.value })
          }
          error={Boolean(errors.streetName)}
          helperText={errors.streetName}
        />
        <TextField
          id="streetNumber"
          label="Street Number"
          variant="standard"
          value={flatData.streetNumber}
          onChange={(e) =>
            setFlatData({ ...flatData, streetNumber: e.target.value })
          }
          error={Boolean(errors.streetNumber)}
          helperText={errors.streetNumber}
        />
        <TextField
          id="areaSize"
          label="Area Size"
          variant="standard"
          value={flatData.areaSize}
          onChange={(e) =>
            setFlatData({ ...flatData, areaSize: e.target.value })
          }
          error={Boolean(errors.areaSize)}
          helperText={errors.areaSize}
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
          labelPlacement="start"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              className={styles["dataPicker"]}
              label="Year Built"
              disableFuture
              views={["year"]}
              openTo="year"
              format="YYYY"
              value={flatData.yearBuilt ? dayjs(flatData.yearBuilt) : null}
              onChange={(e) =>
                setFlatData({ ...flatData, yearBuilt: e ? dayjs(e) : null })
              }
              slotProps={{
                textField: {
                  error: Boolean(errors.yearBuilt),
                  helperText: errors.yearBuilt,
                  variant: "standard",
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          id="rentPrice"
          label="Rent Price"
          variant="standard"
          value={flatData.rentPrice}
          onChange={(e) =>
            setFlatData({ ...flatData, rentPrice: e.target.value })
          }
          error={Boolean(errors.rentPrice)}
          helperText={errors.rentPrice}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              className={styles["dataPicker"]}
              label="Date Available"
              format="DD-MM-YYYY"
              disablePast
              value={
                flatData.dateAvailable ? dayjs(flatData.dateAvailable) : null
              }
              onChange={(e) =>
                setFlatData({ ...flatData, dateAvailable: e ? dayjs(e) : null })
              }
              slotProps={{
                textField: {
                  error: Boolean(errors.dateAvailable),
                  helperText: errors.dateAvailable,
                  variant: "standard",
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        {flatData.imageUrls.map((url, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <TextField
              label={`Image URL ${index + 1}`}
              variant="standard"
              value={url}
              onChange={(e) => {
                const newUrls = [...flatData.imageUrls];
                newUrls[index] = e.target.value;
                setFlatData({ ...flatData, imageUrls: newUrls });
              }}
              style={{ flexGrow: 1, marginRight: 8 }}
              error={Boolean(errors[`imageUrls${index}`])}
              helperText={errors[`imageUrls${index}`]}
            />
            <Button
              onClick={() => {
                const newUrls = flatData.imageUrls.filter(
                  (_, i) => i !== index
                );
                setFlatData({ ...flatData, imageUrls: newUrls });
              }}
              variant="text"
              color="error"
            >
              <DeleteIcon />
            </Button>
          </div>
        ))}
      </Box>
      <Box className={styles["buttonContainer"]}>
        <Button
          onClick={() =>
            setFlatData({ ...flatData, imageUrls: [...flatData.imageUrls, ""] })
          }
          variant="contained"
        >
          Add image
        </Button>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handelNewFlat}
        >
          Create flat
        </Button>
      </Box>
    </div>
  );
};

export default NewFlatComponent;
