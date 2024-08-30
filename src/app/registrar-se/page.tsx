
"use client";

import React, { FormEventHandler, useState } from "react";
import styles from './Register.module.css';
import InputUsername from "@/components/login/username";
import InputPassword from "@/components/login/password";
import InputEmail from "@/components/login/email";
import { useRouter } from "next/navigation";
import ButtonLogin from "@/components/login/buttons/login";
import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import ButtonRegister from "@/components/login/buttons/register";
import { handleError } from "@/utils/handleError";
import { createUser } from "@/services/authService";

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [messageError, setMessageError] = useState('');
  const router = useRouter();

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

  const [loadingRequest, setLoadingRequest] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!password || !username) return;
    if (password !== passwordConfirm) {
      return handleError('Senhas não coincidem');
    }
    if (password.length < 8) {
      return handleError('Senha muito pequena');
    }
    setLoadingRequest(true);

    const data = {
      username,
      email,
      password,
    };

    try {
      const result = await createUser(data);

      if (result?.status === 201) {
        router.push('/login');
      } else {
        setMessageError(result?.data.message);
      }
    } catch (error: unknown) {
      setMessageError(handleError(error));
    }

    setLoadingRequest(false);
  };

  function handleLogin() {
    router.push('/login');
  }

  const handleCloseDialog = () => {
    setMessageError('');
  };

  return (
    <div className={styles.container}>
      <Dialog open={messageError?.length > 0} onClose={handleCloseDialog}>
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
          <div className={styles.Buttons}>
            <ButtonLogin type="submit" label='Registrar' disabledLoading={loadingRequest} />
            <ButtonRegister label='Fazer login' disabledLoading={loadingRequest} onClick={handleLogin} />
          </div>
        </form>
      </div>
    </div>
  );
}
