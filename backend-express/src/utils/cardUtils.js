// Shuffle the cards
export const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

//Distributes cards to players
export const dealCards = (deck, players, handSize) => {
  if (!Array.isArray(players)) {
    throw new Error("players should be an array");
  }

  const hands = players.map((player) => ({
    playerId: player.playerId,
    cards: [],
  }));

  for (let i = 0; i < handSize; i++) {
    for (let j = 0; j < players.length; j++) {
      hands[j].cards.push(deck.pop());
    }
  }

  return hands;
};
