"use client";
export const getRandomImage = () => {
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
