import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@/types/buttons';

const ButtonEnterGame: React.FC<ButtonProps> = ({ onClick, className, label, type }) => {
  return (
    <div>
      <Button type={type} className={className} onClick={onClick} variant='text' color='primary'>
        {label || "Enter Game"}
      </Button>
    </div>
  );
};

export default ButtonEnterGame;