import { TextField } from "@mui/material";
import { useState } from "react";

export default function InputEmail(props: any) {
  const [value, setValue] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleChange = (event: any) => {
    let { value } = event.target;
    setValue(value);

    if (value.length > 0) {
      if (validEmail(value)) {
        setEmailInvalid(false);
      } else {
        setEmailInvalid(true);
      }
    } else {
      setEmailInvalid(false);
    }

    if (emailInvalid) {
      event.target.setCustomValidity("Digite um e-mail válido");
      event.target.reportValidity();
      return;
    }
    event.target.setCustomValidity('');
    props.onChange(value);
  };

  return (
    <TextField
      className={props.className}
      disabled={props.disabled}
      error={emailInvalid}
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

function validEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
