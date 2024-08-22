import React, { FormEventHandler, useState } from "react";
import styles from './Register.module.css';
import InputUsername from "@/components/login/username";
import InputPassword from "@/components/login/password";
import Router from "next/router";
import ButtonLogin from "@/components/login/buttons/login";
import { Cripto } from "@/utils/cripto/password";
import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import ButtonRegister from "@/components/login/buttons/register";
import { getAPIClient } from "@/services/axios";
import { AxiosError } from "axios";
import InputEmail from "@/components/login/email";


export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [messageErro, setMessageErro] = useState('');
  const apiClient = getAPIClient();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
  };

  const [loadingRequest, setLoadingRequest] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!password || !username) return
    if (password != passwordConfirm) {
      return handleError('Senhas não coincidem')
    }
    if (password.length < 8) {
      return handleError('Senha muito pequena')
    }
    setLoadingRequest(true)

    //    const passwordCripto = await Cripto(password);
    const data = {
      username: username,
      email: email,
      password: password
    }

    try {
      const result = await apiClient.post("/api/player", data)

      if (result?.status == 201) {
        Router.push('/login')
      } else {
        setMessageErro(result?.data.message)
      }
    } catch (error: unknown) {
      handleError(error);
    }

    setLoadingRequest(false)
  }

  function handleLogin() {
    Router.push('/login');
  };

  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (error?.response?.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = 'Aconteceu um erro: ' + error.message
      }
    } else {
      errorMessage = error as string || 'erro'

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
        <h2 className={styles.title}>Registrar-se</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <InputUsername required onChange={handleUsernameChange} label='Username' username={username} />
          </div>
          <div className={styles.formGroup}>
            <InputEmail required onChange={handleEmailChange} label='Email' email={email} />
          </div>
          <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordChange} label='Senha' password={password} />
          </div>
          <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordConfirmChange} label='Confirme a Senha' password={passwordConfirm} />
          </div>
          <div className={styles.Buttons} >
            <ButtonLogin type="submit" label='Registrar' disabledLoading={loadingRequest} />
            <ButtonRegister label='Fazer login' disabledLoading={loadingRequest} onClick={handleLogin} />
          </div>
        </form>
      </div>
    </div>
  );
}