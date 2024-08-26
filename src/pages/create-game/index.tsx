import React, { FormEventHandler, useState } from "react";
import styles from './Room.module.css';
import InputUsername from "@/components/login/username";
import InputPassword from "@/components/games/password";
import Router from "next/router";
import ButtomSend from "@/components/login/buttons/send";
import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { getAPIClient } from "@/services/axios";
import { AxiosError } from "axios";
import InputNumber from "@/components/games/maxPlayers";


export default function CreateRoom() {
  const [title, setTitle] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [password, setPassword] = useState('');
  const [messageErro, setMessageErro] = useState('');
  const apiClient = getAPIClient();

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleMaxPlayersChange = (value: string) => {
    setMaxPlayers(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const [loadingRequest, setLoadingRequest] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!password || !title || !maxPlayers) return
    if (password.length < 4) {
      return handleError('Senha muito pequena')
    }
    setLoadingRequest(true)

    const data = {
      title: title,
      maxPlayers: maxPlayers,
      //      password: password
    }

    try {
      const result = await apiClient.post("/api/games", data)


      if (result?.status == 201 && result.data.game_id) {
        Router.push('/game/' + result.data.game_id)
      } else {
        setMessageErro(result?.data.error)
      }
    } catch (error: unknown) {
      handleError(error);
    }

    setLoadingRequest(false)
  }

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
        </div>
        <h2 className={styles.title}>Create Game</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <InputUsername required onChange={handleTitleChange} label='Title' title={title} />
          </div>
          <div className={styles.formGroup}>
            <InputNumber required onChange={handleMaxPlayersChange} label='MaxPlayers' maxPlayers={maxPlayers} />
          </div>
          <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordChange} label='Senha' password={password} />
          </div>
          <div className={styles.Buttons} >
            <ButtomSend type="submit" label='Create' disabledLoading={loadingRequest} />
          </div>
        </form>
      </div>
    </div>
  );
}