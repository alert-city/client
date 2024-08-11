import React from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Autocomplete,
  TextField,
  AutocompleteProps,
} from "@mui/material";

interface CustomAutocompleteProps
  extends Omit<AutocompleteProps<any, any, any, any>, "renderInput"> {
  label: string;
  value: string;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<{}>, newInputValue: string) => void;
  options: string[];
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  label,
  value,
  inputValue,
  onInputChange,
  options,
  ...props
}) => {
  return (
    <Autocomplete
      freeSolo
      disableClearable
      fullWidth
      options={options}
      inputValue={inputValue}
      value={value}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
          fullWidth
        />
      )}
      {...props} // 确保 renderInput 不会被 props 覆盖
    />
  );
};

export default CustomAutocomplete;
