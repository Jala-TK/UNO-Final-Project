import { DeckMonad } from '../src/utils/deckMonad';

describe('DeckMonad', () => {
  it('should shuffle the deck', () => {
    const deck = [1, 2, 3, 4, 5];
    const shuffledDeck = DeckMonad.of(deck).shuffle().deck;

    expect(shuffledDeck).not.toEqual([1, 2, 3, 4, 5]);
    expect(shuffledDeck.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should deal cards to players', () => {
    const deck = [...Array(52).keys()];
    const players = [{ playerId: 1 }, { playerId: 2 }];
    const handSize = 5;

    const hands = DeckMonad.of(deck).shuffle().deal(players, handSize);

    expect(hands.length).toBe(players.length);
    hands.forEach(hand => {
      expect(hand.cards.length).toBe(handSize);
    });
  });

  it('should throw an error if players is not an array', () => {
    const deck = [...Array(52).keys()];

    expect(() => DeckMonad.of(deck).deal({}, 5)).toThrow("players should be an array");
  });
});
