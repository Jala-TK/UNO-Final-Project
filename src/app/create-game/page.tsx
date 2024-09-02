"use client";

import React, { FormEventHandler, useState } from "react";
import styles from './Room.module.css';
import InputUsername from "@/components/login/username";
import InputPassword from "@/components/games/password";
import { useRouter } from "next/navigation";
import ButtonSend from "@/components/login/buttons/send";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { handleError } from "@/utils/handleError";
import InputNumber from "@/components/games/maxPlayers";
import { createGame, readyGame } from "@/services/gameService";
import { useAuth } from "@/context/AuthContext";

export default function CreateRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);

  const handleTitleChange = (value: string) => setTitle(value);
  const handleMaxPlayersChange = (value: string) => setMaxPlayers(value);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!title || !maxPlayers) return;

    setLoadingRequest(true);
    const data = {
      title,
      maxPlayers,
    };

    try {
      const result = await createGame(data);
      if (result.success && result.data.game_id) {
        const gameId = result.data.game_id;
        const readyPlayer = await readyGame(gameId);
        localStorage.setItem('game',
          JSON.stringify(gameId));

        if (readyPlayer) {
          router.push(`/game`);
        }
      } else {
        setMessageError(result?.data.error || 'Erro desconhecido');
      }
    } catch (error: unknown) {
      setMessageError(handleError(error));
    } finally {
      setLoadingRequest(false);
    }
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
          <Button onClick={handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
      <div className={styles.card}>
        <div className={styles.containerHeader}></div>
        <h2 className={styles.title}>Create Game</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <InputUsername required root onChange={handleTitleChange} label='Title' title={title} className={styles.inputText} />
          </div>
          <div className={styles.formGroup}>
            <InputNumber required root onChange={handleMaxPlayersChange} label='Max Players' maxPlayers={maxPlayers} className={styles.inputText} />
          </div>
          {/*           <div className={styles.formGroup}>
            <InputPassword required onChange={handlePasswordChange} label='Senha' password={password} />
          </div> */}
          <div className={styles.Buttons}>
            <ButtonSend type="submit" label='Create' disabledLoading={loadingRequest} />
          </div>
        </form>
      </div>
    </div>
  );
}
