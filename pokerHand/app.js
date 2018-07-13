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
randomFiveCards = checkHand(randomFiveCards);


// Pick 5 random cards from deck
function pickFiveCards(cards) {
    const fiveCards = [];
    for (let i = 1; i <= 5; i++) {
        fiveCards.push(cards[Math.floor((Math.random() * 51))]);
    }
    return fiveCards;
}

// Check hand ranking
function checkHand(cards) {
    let rank = checkPairs(cards);
    
    if(rank === 'No Pair found') {
        rank = checkStraightAndFlush(cards);
    }
    return cards;
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
    console.log('NUMBEROFOCCURENCES: ', numberOfOccurences);
    let results = [];
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
        }
        // Two pair
        if(countOfPairs === 2) {
            hasTwoPair = true;
            hasPair = false;
        }
        // 3 of a kind
        else if(item[2] === '3') {
            hasThree = true;
        }
        // 4 of a kind
        else if(item[2] === '4') {
            hasFour = true;
        }
    });
    results.push(hasPair);
    results.push(hasTwoPair);
    results.push(hasThree);
    results.push(hasFour);
    console.log('RESULTS ', showResults(results));
    
    function showResults(arr) {
        if(arr[0] && arr[2]) {
            return 'Full House';
        }
        else if(arr[0]) {
            return 'One Pair';
        }
        else if(arr[1]) {
            return 'Two Pair';
        }
        else if(arr[2]) {
            return 'Three of a kind';
        }
        else if(arr[3]) {
            return 'Four of a kind';
        }
        else {
            return 'No Pair found';
        }
    }
    
    console.log('hasPair: ', hasPair);
    console.log('hasTwoPair: ', hasTwoPair);
    console.log('countOfPairs: ', countOfPairs);
    console.log('hasThree: ', hasThree);
    console.log('hasFour: ', hasFour);
    console.log('hasNoPair: ', hasNoPair);

    const result = showResults(results);
    document.querySelector('#result').innerHTML = result;
    
    return result;
}

function checkStraightAndFlush(cards) {
    console.log('Checking for straight or flush....');
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
