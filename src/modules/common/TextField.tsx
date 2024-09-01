import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

const CustomTextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const { InputProps, ...rest } = props;

    return (
      <TextField
        margin="normal"
        required
        fullWidth
        InputProps={{
          ...InputProps,
          readOnly: InputProps?.readOnly ?? false,
          sx: {
            ...(InputProps?.sx || {}),
            backgroundColor: InputProps?.readOnly ? "#fff9c4" : undefined, // 只读时的背景颜色
          },
        }}
        {...rest}
        inputRef={ref}
      />
    );
  }
);

export default CustomTextField;
