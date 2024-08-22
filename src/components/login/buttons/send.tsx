import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@/types/buttons';

const ButtonSend: React.FC<ButtonProps> = ({ onClick, disabledLoading, label, type }) => {
  return (
    <div className="buttonSend">
      <Button type={type} onClick={onClick} disabled={disabledLoading} variant='contained' color='primary'>
        {label || 'enviar'}
      </Button>
    </div>
  );
};

export default ButtonSend;