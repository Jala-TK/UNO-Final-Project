import { TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

export default function InputNumber(props: any) {
  const [value, setValue] = useState<number | string>('');
  const [numberInvalid, setNumberInvalid] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    const numberValue = parseInt(value, 10);

    if (isNaN(numberValue) || numberValue < 2 || numberValue > 8) {
      setNumberInvalid(true);
    } else {
      setNumberInvalid(false);
    }

    setValue(value);

    if (numberInvalid) {
      event.target.setCustomValidity("Digite um número válido entre 2 e 8");
      event.target.reportValidity();
      return;
    }
    event.target.setCustomValidity('');
    props.onChange(numberValue);
  };

  return (
    <TextField
      className={props.className}
      disabled={props.disabled}
      error={numberInvalid}
      required={props.required}
      fullWidth={true}
      value={value}
      id="outlined-basic"
      label={props.label}
      variant="outlined"
      type="number"
      inputProps={{ min: 2, max: 8 }}
      onChange={handleChange}
    />
  );
}
