// Shuffle the cards
export const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

//Distributes cards to players
export const dealCards = (deck, numPlayers, handSize) => {
  const hands = Array.from({ length: numPlayers }, () => []);
  for (let i = 0; i < numPlayers; i++) {
    for (let j = 0; j < handSize; j++) {
      hands[i].push(deck.pop());
    }
  }
  return hands;
};
