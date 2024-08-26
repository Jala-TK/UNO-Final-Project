"use client"
import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@/types/buttons';

const ButtonCreateGame: React.FC<ButtonProps> = ({ onClick, disabledLoading, className, label, type }) => {
  return (
    <div>
      <Button type={type} className={className} onClick={onClick} disabled={disabledLoading} variant='text' color='primary'>
        {label || "create game"}
      </Button>
    </div>
  );
};

export default ButtonCreateGame;