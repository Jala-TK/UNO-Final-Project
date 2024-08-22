import { TextField } from "@mui/material";
import { useState } from "react";

export default function InputUsername(props: any) {
  const [value, setValue] = useState('');

  const handleChange = (event: any) => {
    let { value } = event.target;
    setValue(value);
    props.onChange(value);
  };

  return (
    <TextField
      className={props.className}
      disabled={props.disabled}
      required={props.required}
      fullWidth={true}
      value={value}
      id="outlined-basic"
      label={props.label}
      variant="outlined"
      onChange={handleChange}
    />
  );
}

