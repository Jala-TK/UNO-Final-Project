import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function InputPassword(props: any) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: any) => {
    const { value } = event.target;
    props.onChange(value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={props.className}>
      {props.isPasswordRequired ? (
        <TextField
          required={props.required}
          fullWidth={true}
          value={props.password}
          type={showPassword ? 'text' : 'password'}
          id="outlined-basic"
          label={props.label}
          variant="outlined"
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <TextField
          fullWidth={true}
          value={props.password}
          type="text"
          id="outlined-basic"
          label={props.label}
          variant="outlined"
          onChange={handleChange}
        />
      )}
    </div>
  );
};
