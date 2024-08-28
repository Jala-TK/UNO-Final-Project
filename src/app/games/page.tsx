"use client";

import React, { useState, useEffect } from "react";
import styles from './Rooms.module.css';
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Navbar from "@/components/navbar/navbar";
import { getAPIClientNoCache } from "@/services/axios";
import PopUpSettings from "@/components/popup/settings";
import { parseCookies } from 'nookies';
const apiClient = getAPIClientNoCache();
const { 'nextauth.token.user': user } = parseCookies();

const getRandomImage = () => {
  const images = [
    "/assets/game-photos/bane.png",
    "/assets/game-photos/batman.png",
    "/assets/game-photos/batwoman.png",
    "/assets/game-photos/dick.png",
    "/assets/game-photos/future-batman.png",
    "/assets/game-photos/harley-quinn.png",
    "/assets/game-photos/jason.png",
    "/assets/game-photos/joker.png",
    "/assets/game-photos/penguin.png",
    "/assets/game-photos/robin.png"
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

interface RoomProps {
  id: number;
  title: string;
  status: string;
  maxPlayers: number;
  playersInGame: number;
  creator: string;
  players: string[];
}

async function enterGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient.post(`/api/game/join?timestamp=${new Date().getTime()}`, { game_id: gameId });
  if (result.status === 200) {
    const result = await apiClient.post(`/api/game/ready?timestamp=${new Date().getTime()}`, { game_id: gameId });
    return true;
  }
  return false;
}

const RoomsDisponiveis: React.FC = () => {
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [messageError, setMessageError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomProps>();


  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const gamesInfo = await apiClient.get(`/api/games?timestamp=${new Date().getTime()}`);
        setRooms(gamesInfo.data.games);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    const interval = setInterval(fetchRoomData, 60000)
    return () => clearInterval(interval);
  }, []);

  const handleClosePopup = async () => {
    setShowPopup(false);
  };

  const handleConfirm = async () => {
    try {
      const enter = selectedRoom ? await enterGame(selectedRoom.id) : false;
      if (enter && selectedRoom) {
        setShowPopup(false);
        router.push(`/game/${selectedRoom.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const handleEnter = (room: RoomProps) => {
    if (room.creator === user) {
      router.push(`/game/${room.id}`);
    }
    else {
      console.log(room.players.includes(user))
      setSelectedRoom(room);
      setShowPopup(true);
    }

  };

  const handleError = (error: unknown) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (error?.response?.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = 'Aconteceu um erro: ' + error.message;
      }
    } else {
      errorMessage = error as string || 'Erro';
    }

    setMessageError(errorMessage);
  };

  const handleCloseDialog = () => {
    setMessageError('');
  };

  function handleCreateGame() {
    router.push('/create-game');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>


      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.roomsDisponiveis}>
          <Dialog open={messageError.length > 0} onClose={handleCloseDialog}>
            <DialogContent className={styles.dialogConfirmation}>
              {messageError}
            </DialogContent>
            <DialogActions className={styles.dialogConfirmation}>
              <Button onClick={handleCloseDialog}>Ok</Button>
            </DialogActions>
          </Dialog>

          <h2 className={styles.titlePage}>Rooms</h2>
          <div className={styles.roomsContainer}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.game}>
                <img
                  className={styles.backgroundIcon}
                  alt="Background"
                  src="/assets/rooms/BackGround.svg"
                />
                <img
                  className={styles.profileIcon}
                  alt="Profile"
                  src={getRandomImage()}
                />
                <div className={styles.texts}>
                  <div className={styles.title}>
                    <b className={styles.text}>{room.title} </b>
                    <div className={styles.id}>#{room.id}</div>
                  </div>
                  <div className={styles.playersStatus}>
                    <div className={styles.status}>{room.status}</div>
                    <div className={styles.players}>
                      <img
                        className={styles.playersIcon}
                        alt="Players"
                        src="/assets/rooms/Players.svg"
                      />
                      <div className={styles.text}>{room.playersInGame}/{room.maxPlayers}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.challengeButtom} onClick={() => handleEnter(room)}>
                  <div className={styles.challengeButtomChild} />
                  <b className={styles.enter} >Enter</b>
                </div>
              </div>
            ))}
          </div>
          <div>
            {showPopup && selectedRoom && (
              <PopUpSettings
                title={selectedRoom.title}
                waitingMessage={selectedRoom.status}
                playerCount={`${selectedRoom.players.length}/${selectedRoom.maxPlayers}`}
                buttonText={!selectedRoom.players.includes(user) ? "Enter Game" : "Back"}
                onClose={handleClosePopup}
                onConfirm={!selectedRoom.players.includes(user) ? handleConfirm : handleClosePopup}
              />
            )}
          </div>
        </div>
        <button className={styles.createButton} onClick={handleCreateGame} >Create Game</button>
      </div>
    </div>
  );
};

export default RoomsDisponiveis;
