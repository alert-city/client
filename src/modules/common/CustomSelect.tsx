import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
} from "@mui/material";

type CustomSelectProps = SelectProps & {
  label: string;
  options: Array<{ value: string | number; label: string }>;
  readOnly?: boolean;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  readOnly,
  ...props
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        inputProps={{
          readOnly: readOnly,
          sx: {
            backgroundColor: readOnly ? "#fff9c4" : undefined,
          },
        }}
        {...props}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
