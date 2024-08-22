import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@/types/buttons';

const ButtonLogin: React.FC<ButtonProps> = ({ onClick, disabledLoading, label, type }) => {
  return (
    <div className="buttonRegister">
      <Button type={type} onClick={onClick} disabled={disabledLoading} variant='contained' color='primary'>
        {label || 'entrar'}
      </Button>
    </div>
  );
};

export default ButtonLogin;