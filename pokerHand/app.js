const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];

function Card(value, suit, name) {
    this.value = value;
    this.suit = suit;
    this.name = name;
}
const deck = [];
let i,j;
let card;

// Populate cards
for (i = 0; i < 13; i++) {
    for (j = 0; j < 4; j++) {
    // ACE
    if(i === 0) {
        card = new Card(i+1, suits[j], `Ace of ${suits[j]}`);
        deck.push(card);
    }
    // JACK
    else if(i === 10) {
        card = new Card(i+1, suits[j], `Jack of ${suits[j]}`);
        deck.push(card);
    }
    // QUEEN
    else if(i === 11) {
        card = new Card(i+1, suits[j], `Queen of ${suits[j]}`);
        deck.push(card);
    }
    // KING
    else if(i === 12) {
        card = new Card(i+1, suits[j], `King of ${suits[j]}`);
        deck.push(card);
    }
    else {
        card = new Card(i+1, suits[j], `${i + 1} of ${suits[j]}`);
        deck.push(card);
    }
  }
}


// Randomly pick 5 cards and put them in an array
let randomFiveCards = pickFiveCards(deck);
// Show hand in page
showInPage(randomFiveCards);
// Check hand ranking
let result = checkHand(randomFiveCards);
document.querySelector('#result').innerHTML = result;

// Pick 5 random cards from deck
function pickFiveCards(cards) {
    const fiveCards = [];
    while (fiveCards.length < 5) {
        let randomCard = cards[Math.floor((Math.random() * 51))];   
        if(!contains(randomCard, fiveCards)) {
            fiveCards.push(randomCard);
        }
    }

    // FOR TESTING PURPOSES

    // [PREDETERMINED HAND - FULL HOUSE ACES/DUCES]
    // fiveCards.push(deck[1]);
    // fiveCards.push(deck[2]);
    // fiveCards.push(deck[3]);
    // fiveCards.push(deck[5]);
    // fiveCards.push(deck[6]);

    // [PREDETERMINED HAND - STRAIGHT 1-5]
    // fiveCards.push(deck[1]);
    // fiveCards.push(deck[4]);
    // fiveCards.push(deck[8]);
    // fiveCards.push(deck[12]);
    // fiveCards.push(deck[16]);

    // [PREDETERMINED HAND - STRAIGHT FLUSH 9-K]
    // fiveCards.push(deck[32]);
    // fiveCards.push(deck[36]);
    // fiveCards.push(deck[40]);
    // fiveCards.push(deck[44]);
    // fiveCards.push(deck[48]);

    // [PREDETERMINED HAND - FLUSH ROYALE]
    // fiveCards.push(deck[0]);
    // fiveCards.push(deck[36]);
    // fiveCards.push(deck[40]);
    // fiveCards.push(deck[44]);
    // fiveCards.push(deck[48]);

    return fiveCards;
}

function contains(item, array) {
    const index = array.indexOf(item);
    if(index >= 0) {
        return true;
    }
    else return false;
}

// Check hand ranking
function checkHand(cards) {
    let rank = checkPairs(cards);
    console.log(' RANK -> ' , rank)
    if(rank === 'No Pair found') {
        rank = checkStraightAndFlush(cards);
        if(rank === 'No Straight or Flush found') {
            let largest = cards.sort(function(a, b) {
                return a.value-b.value;
            });
            // ACE
            if(largest[0].value === 1) {
                largest = cards[0];
            }
            else {
                largest = cards[cards.length - 1];
            }
            rank = largest.name.split(' ')[0] + ' High';
        }
    }
    return rank;
}

function checkPairs(cards) {
    let unique = cards.map(function(item) {
        return item.value;
    });
    unique = unique.filter(function(item, i, ar) {
        console.log(ar.indexOf(item), ' asd ', item);
        return ar.indexOf(item) === i;
    });
    console.log('UNIQUE: ', unique);
    let numberOfOccurences = [];
    let count = 0;
    let i, j;
    for(j = 0; j < unique.length; j++) {
        for(i = 0; i < cards.length; i++) {
            if(cards[i].value === unique[j]) {
                count++;
            }
        }
        numberOfOccurences.push(`${unique[j]} -> ${count}`);
        count = 0;
    }
    console.log('NUMBER OF OCCURENCES: ', numberOfOccurences);
    let results = [];
    let pairs = [];
    // Check pair
    let hasPair = false;
    let countOfPairs = 0;
    // Check 2 pair
    let hasTwoPair = false;
    // Check 3 of a kind
    let hasThree = false;
    // Check 4 of a kind
    let hasFour = false;
    // No pair
    let hasNoPair = false;
    // Full House
    let hasFullHouse = false;

    // KIND OF PAIR FLAG
    numberOfOccurences.forEach(function(item) {
        // item[2] is 3rd character of string '1 -> 2' AFTER splitting(), showing how many times it exists
        item = item.split(' ');
        // Pair
        if(item[2] === '2') {
            hasPair = true;
            countOfPairs++;
            pairs.push(item);
        }
        // Two pair
        if(countOfPairs === 2) {
            hasTwoPair = true;
            hasPair = false;
        }
        // 3 of a kind
        else if(item[2] === '3') {
            hasThree = true;
            pairs.push(item);
        }
        // 4 of a kind
        else if(item[2] === '4') {
            hasFour = true;
            pairs.push(item);
        }
    });
    results.push(hasPair);
    results.push(hasTwoPair);
    results.push(hasThree);
    results.push(hasFour);
    console.log('RESULTSSSSS', results);
    console.log('RESULTS ', showResults(results, pairs));
    console.log('PAIRS -> ', pairs);

    function showResults(arr, pairs) {
        if(arr[0] && arr[2]) {
            return (pairs[0][2] > pairs[1][2] ? 
                `Full House! ${giveNameToValue(pairs[0][0])}'s over ${giveNameToValue(pairs[1][0])}'s` :
                `Full House! ${giveNameToValue(pairs[1][0])}'s over ${giveNameToValue(pairs[0][0])}'s`)
            ;
        }
        else if(arr[0]) {
            return `One Pair of ${giveNameToValue(pairs[0][0])}${giveNameToValue(pairs[0][0]).length > 2 ? 's' : "'s"}!`;
        }
        else if(arr[1]) {
            return `Two Pairs of ${giveNameToValue(pairs[0][0])}${giveNameToValue(pairs[0][0]).length > 2 ? 's' : "'s"} and ${giveNameToValue(pairs[1][0])}${giveNameToValue(pairs[1][0]).length > 2 ? 's' : "'s"} `;
        }
        else if(arr[2]) {
            return `Three of a kind! ${giveNameToValue(pairs[0][0])}${giveNameToValue(pairs[0][0]).length > 2 ? 's' : "'s"}!`;
        }
        else if(arr[3]) {
            return `Four of a kind! ${giveNameToValue(pairs[0][0])}${giveNameToValue(pairs[0][0]).length > 2 ? 's' : "'s"}!`;
        }
        else {
            return 'No Pair found';
        }
    }

    function giveNameToValue(value) {
        if(value === '1') {
            return 'Ace';
        }
        else if(value === '11') {
            return 'Jack';
        }
        else if(value === '12') {
            return 'Queen';
        }
        else if(value === '13') {
            return 'King';
        }
        else {
            return value;
        }
    }   
    
    console.log('hasPair: ', hasPair);
    console.log('hasTwoPair: ', hasTwoPair);
    console.log('countOfPairs: ', countOfPairs);
    console.log('hasThree: ', hasThree);
    console.log('hasFour: ', hasFour);
    console.log('hasNoPair: ', hasNoPair);

    const result = showResults(results, pairs);

    return result;
}

function checkStraightAndFlush(cards) {
    let straightResult = checkStraight(cards);
    let flushResult = checkFlush(cards);
    console.log('straightResult>>>>>', straightResult);
    console.log('flushResult>>>>>', flushResult);

    let result;
    
    // STRAIGHT FLUSH & FLUSH ROYALE CASES
    if(straightResult != 'No Straight found' && flushResult != 'No Flush found') {
        let sortedCards = cards.sort(function(a, b) {
            return a.value-b.value;
        });
        // Special case: FLUSH ROYALE
        if((sortedCards[sortedCards.length -1].value === 13) && (sortedCards[0].value === 1)) {
            result =  `Flush Royale! ${sortedCards[1].value} to ${sortedCards[0].value}`;
        } 
        else {
            result = `Straight Flush! ${sortedCards[0].value} to ${sortedCards[sortedCards.length -1].value}`;
        }
    }
    // Flush
    if(straightResult === 'No Straight found' && flushResult != 'No Flush found') {
        result = flushResult;
    }
    else if(straightResult != 'No Straight found' && flushResult === 'No Flush found') {
        result = straightResult;
    }
    else if(straightResult === 'No Straight found' && flushResult === 'No Flush found') {
        result = 'No Straight or Flush found';
    }
    return result;
}

function checkStraight(cards) {
    let sortedCards = cards.sort(function(a, b) {
        return a.value-b.value;
    });
    sortedCards.forEach(function(item) {
        console.log(item.value);
    })
    // Special case: Ace High Straight
    if((sortedCards[sortedCards.length -1].value === 13) && (sortedCards[1].value === 10) && (sortedCards[0].value === 1)) {
        return `Straight! ${sortedCards[1].value} to ${sortedCards[0].value}`;
    } 
    // If straight, [last value - first value === 4] (in sorted array)
    if(sortedCards[sortedCards.length - 1].value - sortedCards[0].value === 4) {
        return `Straight! ${sortedCards[0].value} to ${sortedCards[sortedCards.length -1].value}`;
    }
    else {
        return 'No Straight found';
    }
}

function checkFlush(cards) {
    // Check if every card's suit is the same as the first card's
    if(cards.every(function(card) {
        return card.suit === cards[0].suit;
    })) {
        return `Flush! 5 ${cards[0].suit}!`;
    } 
    else {
        return 'No Flush found';
    }
}



function showInPage(cards) {
    let output = '';
    let htmlcards = document.querySelector('#cards');
    cards.forEach(function(item) {
        output = `<li> ${item.name} </li>`;
        htmlcards.innerHTML += output;
    });
}
// console.log(cards);
console.log(deck.length);
console.log('rfc', randomFiveCards);
