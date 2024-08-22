export class DeckMonad {
  constructor(deck) {
    this.deck = deck;
  }

  static of(deck) {
    return new DeckMonad(deck);
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    return this;
  }

  deal(players, handSize) {
    if (!Array.isArray(players)) {
      throw new Error("players should be an array");
    }

    const hands = players.map((player) => ({
      playerId: player.playerId,
      cards: [],
    }));

    for (let i = 0; i < handSize; i++) {
      for (let j = 0; j < players.length; j++) {
        hands[j].cards.push(this.deck.pop());
      }
    }

    return hands;
  }
}

