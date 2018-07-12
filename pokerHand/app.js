const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];

function Card(value, suit, name) {
  this.value = value;
  this.suit = suit;
  this.name = name;
}
const cards = [];
let i,j;
let hand;

// Populate cards
for (i = 0; i < 13; i++) {
  for (j = 0; j < 4; j++) {
    // ACE
    if(i === 0) {
      hand = new Card(i+1, suits[j], `Ace of ${suits[j]}`);
      cards.push(hand);
    }
    // JACK
    else if(i === 10) {
      hand = new Card(i+1, suits[j], `Jack of ${suits[j]}`);
      cards.push(hand);
    }
    // QUEEN
    else if(i === 11) {
      hand = new Card(i+1, suits[j], `Queen of ${suits[j]}`);
      cards.push(hand);
    }
    // KING
    else if(i === 12) {
      hand = new Card(i+1, suits[j], `King of ${suits[j]}`);
      cards.push(hand);
    }
    else {
      const hand = new Card(i+1, suits[j], `${i + 1} of ${suits[j]}`);
      cards.push(hand);
    }
  }
}


// Randomly pick 5 cards and put them in an array
let randomFiveCards = pickFiveCards(cards);
// Check hand ranking
randomFiveCards = checkHand(randomFiveCards);


function pickFiveCards(cards) {
  const fiveCards = [];
  for (let i = 1; i <= 5; i++) {
    fiveCards.push(cards[Math.floor((Math.random() * 51))]);
  }
  return fiveCards;
}

function checkHand(cards) {
  cards.sort(function(a, b) {
    return a.value - b.value;
  });
  checkFlush(cards);
  return cards;
}

function checkFlush(cards) {
  // let isFlush = false;
  // cards.forEach(function(card) {
  //   if(card.suit == cards[0].suit) {
  //     isFlush = true;
  //   }
  //   else {
  //     isFlush = false;
  //   }
  // });
  // console.log('Flush: ', isFlush);
  // console.log(cards);
  // return isFlush;

}
// console.log(cards);
console.log(cards.length);
console.log('rfc', randomFiveCards);