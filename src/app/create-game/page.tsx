"use client";

import React, { FormEventHandler, useState } from "react";
import styles from './Room.module.css';
import InputUsername from "@/components/login/username";
import InputPassword from "@/components/games/password";
import { useRouter } from "next/navigation";
import ButtonSend from "@/components/login/buttons/send";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { getAPIClient } from "@/services/axios";
import { AxiosError } from "axios";
import InputNumber from "@/components/games/maxPlayers";

export default function CreateRoom() {
  const [title, setTitle] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [password, setPassword] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const apiClient = getAPIClient();
  const router = useRouter();

  const handleTitleChange = (value: string) => setTitle(value);
  const handleMaxPlayersChange = (value: string) => setMaxPlayers(value);
  const handlePasswordChange = (value: string) => setPassword(value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!password || !title || !maxPlayers) return;
    if (password.length < 4) {
      return handleError('Senha muito pequena');
    }

    setLoadingRequest(true);

    const data = {
      title,
      maxPlayers,
      // password //TODO: Adicionar o campo password
    };

    try {
      const result = await apiClient.post("/api/games", data);

      if (result?.status === 201 && result.data.game_id) {
        const readyPlayer = await apiClient.post("/api/game/ready", { game_id: result.data.game_id });
        if (readyPlayer.status === 200) {
          router.push(`/game/${result.data.game_id}`);
        }
      } else {
        setMessageError(result?.data.error || 'Erro desconhecido');
      }
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      errorMessage = error.response?.data.error || 'Aconteceu um erro: ' + error.message;
    } else {
      errorMessage = error as string || 'Erro desconhecido';
    }

    setMessageError(errorMessage);
  };

  const handleRejectForceDialogClose = () => setMessageError('');

  return (
    <div className={styles.container}>
      <Dialog open={!!messageError} onClose={handleRejectForceDialogClose}>
        <DialogContent className={styles.dialogConfirmation}>
          {messageError}
        </DialogContent>
        <DialogActions className={styles.dialogConfirmation}>
          <Button onClick={handleRejectForceDialogClose}>Ok</Button>
        </DialogActions>
      </Dialog>
      <div className={styles.card}>
        <div className={styles.containerHeader}></div>
        <h2 className={styles.title}>Create Game</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <InputUsername required onChange={handleTitleChange} label='Title' title={title} />
          </div>
          <div className={styles.formGroup}>
            <InputNumber required onChange={handleMaxPlayersChange} label='Max Players' maxPlayers={maxPlayers} />
          </div>
          <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordChange} label='Senha' password={password} />
          </div>
          <div className={styles.Buttons}>
            <ButtonSend type="submit" label='Create' disabledLoading={loadingRequest} />
          </div>
        </form>
      </div>
    </div>
  );
}
