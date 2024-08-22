import { TextField } from "@mui/material"
import { ChangeEvent } from 'react'

export default function InputText(props: any) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target;
    props.onChange(value);
  }

  return (
    <div className="inputText">
      <TextField
        disabled={props.disabled}
        required={props.required}
        fullWidth={true}
        value={props.value}
        id="outlined-basic"
        label={props.label}
        variant="outlined"
        onChange={handleChange} />
    </div>
  )
}