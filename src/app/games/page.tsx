"use client";

import React, { useState, useEffect } from "react";
import styles from './Rooms.module.css';
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useRouter } from "next/navigation";
import PopUpSettings from "@/components/popup";
import { parseCookies } from 'nookies';
import { useSocket } from '@/context/SocketContext';
import { handleError } from '@/utils/handleError';
import { getGames, enterGame } from '@/services/gameService';
import { getRandomImage } from "./getRandomImage";

const { 'nextauth.token.user': user } = parseCookies();

interface RoomProps {
  id: number;
  title: string;
  status: string;
  maxPlayers: number;
  playersInGame: number;
  creator: string;
  players: string[];
}

const RoomsDisponiveis: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [messageError, setMessageError] = useState('');
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomProps>();

  const fetchRoomData = async () => {
    try {
      const gamesInfo = await getGames()
      const waitingRooms = gamesInfo.data.games.filter(
        (room: { status: string; }) => room.status === 'Waiting for players');
      setRooms(waitingRooms);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    if (isConnected) {
      fetchRoomData();
    }

    const handleUpdate = async (message: string) => {
      if (message === 'updatedGames' || message === 'playerInGame') {
        console.log('Jogos atualizados', message);
        const gamesInfo = await getGames()
        setRooms(gamesInfo.data.games);
      }
    };

    socket.on('update', handleUpdate);

    return () => {
      socket.off('update', handleUpdate);
    };
  }, [socket, isConnected]);



  const handleClosePopup = async () => {
    setShowPopup(false);
  };

  const handleConfirm = async () => {
    try {
      const enter = await enterGame(selectedRoom!.id);
      if (enter && selectedRoom) {
        setShowPopup(false);
        fetchRoomData();
        router.push(`/game/${selectedRoom.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleEnter = (room: RoomProps) => {
    setSelectedRoom(room);
    if (room.creator === user) {
      router.push(`/game/${room.id}`);
    }
    else {
      console.log(room.players.includes(user))
      setShowPopup(true);
    }
  };

  const handleCloseDialog = () => {
    setMessageError('');
  };

  function handleCreateGame() {
    router.push('/create-game');
  };

  return (
    <div>
      <div className={styles.pageContainer}>
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
