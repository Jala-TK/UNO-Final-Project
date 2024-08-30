"use client"
import React, { useState, useContext } from 'react';
import styles from './Login.module.css';
import InputPassword from "@/components/login/password";
import { AuthContext } from "@/context/AuthContext";
import ButtonLogin from "@/components/login/buttons/login";
import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { SignInRequestData } from "@/types/login";
import ButtonRegister from "@/components/login/buttons/register";
import InputUsername from "@/components/login/username";
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { handleError } from '@/utils/handleError';

export default function Login({ redirectRoute }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageErro, setMessageErro] = useState('');
  const [messageError, setMessageError] = useState('');
  const router = useRouter();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const { signIn } = useContext(AuthContext);

  const [loadingRequest, setLoadingRequest] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) return;

    setLoadingRequest(true);

    const dataSession: SignInRequestData = {
      username,
      password,
    };
    try {
      const result = await login(dataSession);
      if (result?.status === 200) {
        await signIn(dataSession);
        router.push('/games');
      } else {
        setMessageErro(result?.data.error);
      }
    } catch (error: unknown) {
      setMessageError(handleError(error));
    }

    setLoadingRequest(false);
  };

  const handleRegister = () => {
    router.push('/registrar-se');
  };


  const handleCloseDialog = () => {
    setMessageError('');
  };


  return (
    <div className={styles.container}>
      <Dialog open={!!messageError} onClose={handleCloseDialog}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button className={styles.buttonYes} onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
      <div className={styles.card}>
        <div className={styles.containerHeader}>
          <Box
            component="img"
            className={styles.logo}
            src="/assets/image.png"
            alt='Logo'
            sx={{ width: 228, height: 228 }}
          />
        </div>
        <h2 className={styles.title}>Login</h2>
        <form>
          <div className={styles.formGroup}>
            <InputUsername required onChange={handleUsernameChange} label='Username' username={username} />
          </div>
          <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordChange} label='Senha' password={password} />
          </div>
          <div className={styles.Buttons}>
            <ButtonLogin type='submit' disabledLoading={loadingRequest} onClick={handleSubmit} />
            <ButtonRegister className={styles.registerButton} disabledLoading={loadingRequest} onClick={handleRegister} />
          </div>
        </form>
      </div>
    </div>
  );
}
