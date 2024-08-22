import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@/types/buttons';
import { useRouter } from "next/router";

const ButtonBack: React.FC<ButtonProps> = ({ disabledLoading, label, type }) => {
  const router = useRouter();
  const handleBack = () => {
    router.push('/login')
  };
  return (
    <div className="buttonBack">
      <Button type={type} onClick={handleBack} disabled={disabledLoading} variant='contained' color='primary'>
        {label || 'Ir para Login'}
      </Button>
    </div>
  );
};

export default ButtonBack;