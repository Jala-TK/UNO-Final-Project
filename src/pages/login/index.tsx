import React, { useState } from "react";
import styles from './Login.module.css';
import InputPassword from "@/components/login/password";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from 'react';
import Router from "next/router";
import ButtonLogin from "@/components/login/buttons/login";
import { GetServerSideProps } from "next";
import { Cripto } from "@/utils/cripto/password";
import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { SignInRequestData } from "@/types/login";
import ButtonRegister from "@/components/login/buttons/register";
import { AxiosError } from "axios";
import InputUsername from "@/components/login/username";
import { getAPIClient } from "@/services/axios";

export const getServerSideProps: GetServerSideProps<{
  redirectRoute: string;
}> = async (ctx) => {
  const { redirect } = ctx.query;
  const redirectRoute = typeof redirect === 'string' ? redirect : '/dashboard';

  return {
    props: {
      redirectRoute,
    },
  };
};

export default function Login({ redirectRoute }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageErro, setMessageErro] = useState('');
  const apiClient = getAPIClient();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const { signIn } = useContext(AuthContext);

  const [loadingRequest, setLoadingRequest] = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) return;

    setLoadingRequest(true)

    const dataSession: SignInRequestData = {
      username: username,
      password: password,
    };
    try {
      const result = await apiClient.post("/api/login", dataSession)

      if (result?.status == 200) {
        Router.push('/rooms')
      } else {
        setMessageErro(result?.data.error)
      }
    } catch (error: unknown) {
      handleError(error);
    }


    setLoadingRequest(false)
  };

  function handleRegister() {
    Router.push('/registrar-se');
  };


  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (error?.response?.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = 'Aconteceu um erro: ' + error.message
      }
    } else {
      errorMessage = "erro, fale com a T.I: 500";
    }
    setMessageErro(errorMessage);
  };


  const handleRejectForceDialogClose = () => {
    setMessageErro('')
  }

  return (
    <div className={styles.container}>
      <Dialog open={messageErro?.length > 0} onClose={handleRejectForceDialogClose}>
        <DialogContent className={styles.dialogConfirmation} >
          {messageErro}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button className={styles.buttonYes} onClick={handleRejectForceDialogClose}>Ok</Button>
        </DialogActions>
      </Dialog>
      <div className={styles.card}>
        <div className={styles.containerHeader}>
          <Box
            component="img"
            className={styles.logo}
            src="/assets/image.png"
            alt='Logo'
            sx={{
              width: 228,
              height: 228,
            }}
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
          <div className={styles.Buttons} >
            <ButtonLogin type='submit' disabledLoading={loadingRequest} onClick={handleSubmit} />
            <ButtonRegister className={styles.registerButton} disabledLoading={loadingRequest} onClick={handleRegister} />
          </div>
        </form>
      </div>
    </div>
  );
}