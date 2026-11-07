import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import React from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

const StyledSwitch = styled(Switch)(() => ({
  width: 75,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",

    "&.Mui-checked": {
      transform: "translateX(38px)",
      color: "#fff",

      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    position: "relative",
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    backgroundColor: "#fff",
    opacity: 1,
  },
}));

type Props = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MaterialUISwitchWithIcon({ checked, onChange }: Props) {
  return (
    <div style={{ position: "relative" }}>
      <StyledSwitch checked={checked} onChange={onChange} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: checked ? "55px" : "23px",
          transform: "translate(-50%, -46%)",
          pointerEvents: "none",
          color: "white",
        }}
      >
        {checked ? (
          <AcUnitIcon fontSize="small" />
        ) : (
          <WbSunnyIcon fontSize="small" />
        )}
      </div>
    </div>
  );
}
