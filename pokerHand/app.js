const deck = [];
const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];

function Card(value, suit, name) {
    this.value = value;
    this.suit = suit;
    this.name = name;
}

// Populate deck
populate(deck);
// Randomly pick 5 cards and put them in an array
let fiveRandomCards = pickFiveCards(deck);
// Show hand in page
showInPage(fiveRandomCards);
// Check hand ranking
let result = checkHand(fiveRandomCards);
// Show result
document.querySelector('#result').innerHTML = result;


function populate(deck) {
    let i,j;
    let card;

    for (i = 0; i < 13; i++) {
        
        for (j = 0; j < 4; j++) {
            
            let cardName;
            
            switch(i) {
                case 0: 
                    cardName = 'Ace';
                    break;
                case 10: 
                    cardName = 'Jack';
                    break;
                case 11: 
                    cardName = 'Queen';
                    break;
                case 12: 
                    cardName = 'King';
                    break;
                default:
                    cardName = i+1;
                    break;
            };

            card = new Card(i+1, suits[j], `${cardName} of ${suits[j]}`);
            deck.push(card);
      }
    }
}

// Pick 5 random cards from deck
function pickFiveCards(cards) {
    const fiveCards = [];
    while (fiveCards.length < 5) {
        let randomCard = cards[Math.floor((Math.random() * 51))];   
        if(!contains(randomCard, fiveCards)) {
            fiveCards.push(randomCard);
        }
    }

    // ***HARD CODED TESTS***

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
    // fiveCards.push(deck[44]);
    // fiveCards.push(deck[40]);
    // fiveCards.push(deck[48]);
    // [PREDETERMINED HAND - FOUR OF A KIND]
    // fiveCards.push(deck[0]);
    // fiveCards.push(deck[1]);
    // fiveCards.push(deck[2]);
    // fiveCards.push(deck[3]);
    // fiveCards.push(deck[10]);
    // [PREDETERMINED HAND - 2 PAIR (TENS, KINGS) ACE HIGH]
    // fiveCards.push(deck[0]);
    // fiveCards.push(deck[36]);
    // fiveCards.push(deck[37]);
    // fiveCards.push(deck[48]);
    // fiveCards.push(deck[49]);
    
    return fiveCards;
}

function contains(item, array) {
    const index = array.indexOf(item);
    if(index >= 0) {
        return true;
    }
    return false;
}

function checkHand(cards) {
    let rank = '';
    
    let straightResult = checkStraight(cards);
    let flushResult = checkFlush(cards);
    let pairResult = checkPairs(cards).pairs;
    
    // Determine hand ranking to show in page. Will remake
    let arr = [];
    arr.push(flushResult, straightResult, pairResult);
    arr = arr.filter(function(a) {
        return a.values != 0;
    })

    if(arr.length === 0) {
        rank = `${giveNameToValue(findHighCard(cards))} high. Keep betting, you'll luck out eventually!`;
    }
    else {
        rank = arr[0].text;
    };

    console.log('Pair: ', pairResult);
    console.log('Flush: ', flushResult);
    console.log('Straight: ', straightResult);
    
    // Straight Flush combos
    if(straightResult.values != 0 && flushResult.values != 0) {
        if(straightResult.isAceHighStraight) {
            rank = `Royal Flush!!! Ten to Ace all ${flushResult.values}!`;
        } 
        else {
            rank = `Straight Flush!!! ${giveNameToValue(findHighCard(cards) - 4)} to ${giveNameToValue(findHighCard(cards))} all ${flushResult.values}!!`;
        }
    };

    return rank;
}

function checkPairs(cards) {
    
    const cardValues = cards.map(function(item) {
        return item.value;
    });
    const uniqueCards = cardValues.filter((card, index, cardValues) => {
        return cardValues.indexOf(card) === index;
    });
    console.log('UNIQUE: ', uniqueCards);

    const numberOfOccurences = [];

    function CardWithCount(value, count) {
        this.value = value,
        this.count = count
    }

    // Push cards into array with number of occurences
    uniqueCards.forEach(function(uniqueCard) {
        let count = 0;
        let cardWithCount = new CardWithCount();
        
        cardValues.forEach(function(cardValue) {
            if(uniqueCard === cardValue) {
                cardWithCount.value = uniqueCard;
                count++;
            };         
        })

        cardWithCount.count = count;
        numberOfOccurences.push(cardWithCount);
    })

    // Get pairs
    const pairs = numberOfOccurences.filter(function(card) {
        return (card.count > 1);
    });
    // Get high card
    const highCards = numberOfOccurences.filter(function(card) {
        return (card.count === 1)
    });
    const highCard = findHighCard(highCards);
                                
    console.log('PAIRS: ', pairs);
    console.log('HIGH CARD: ', highCard);
    console.log('NUMBER OF OCCURENCES: ', numberOfOccurences);
    
    const result = {
        pairs: [],
        highCard: 0
    }
    
    result.pairs = getResult(pairs, highCard);
    result.highCard = highCard;

    // Get hand ranking and respective values
    function getResult(pairs, highCard) {
        let result = {
            text: '',
            values: [],
            highCard: highCard
        };
        highCard = giveNameToValue(highCard);
        // One Pair / Three of a kind / Four of a kind
        if(pairs.length === 1) { 
            let firstNamedValue = giveNameToValue(pairs[0].value);   
            // One pair
            if(pairs[0].count === 2) {
                result.text = `One pair! ${firstNamedValue}${apostropheOrNot(firstNamedValue)} with kicker ${highCard}`;
                result.values = pairs[0].value;
            }
            // Three of a kind
            else if(pairs[0].count === 3) {
                result.text = `Three of a kind! ${firstNamedValue}${apostropheOrNot(firstNamedValue)}  with kicker ${highCard}`;
                result.values = pairs[0].value;
            }
             // Four of a kind
             else if(pairs[0].count === 4) {
                result.text = `Four of a kind! ${firstNamedValue}${apostropheOrNot(firstNamedValue)}  with kicker ${highCard}`;
                result.values = pairs[0].value;
            }
        }
        // Two Pair / Full House
        else if(pairs.length === 2) {
            let firstNamedValue = giveNameToValue(pairs[0].value);
            let secondNamedValue = giveNameToValue(pairs[1].value);
            // Two Pair
            if(pairs[0].count === 2 && pairs[0].count === 2) {
                result.text = `Two Pair! ${firstNamedValue}${apostropheOrNot(firstNamedValue)} and ${secondNamedValue}${apostropheOrNot(secondNamedValue)}  with kicker ${highCard}`;
                result.values.push(pairs[0].value);
                result.values.push(pairs[1].value);
            }
            // Full house
            else {
                result.text = `Full House! ${firstNamedValue}${apostropheOrNot(firstNamedValue)} and ${secondNamedValue}${apostropheOrNot(secondNamedValue)}`;
                result.values.push(pairs[0].value);
                result.values.push(pairs[1].value);
            }
        }
        // No pair
        else if(pairs.length === 0) {
            result.text = 'No pair found';
            result.values = 0;
        }

        return result;
    }

    return result;
}

function checkStraight(cards) {
    const sortedCards = cards.sort(function(a, b) {
        return a.value - b.value;
    });

    const lastCard = sortedCards[sortedCards.length -1].value;
    const secondCard = sortedCards[1].value;
    const firstCard = sortedCards[0].value;
    
    const hasAce = firstCard === 1;

    const result = {
        text: '',
        values: [],
        isAceHighStraight: false
    }

    const consecutivesResult = checkConsecutives(hasAce, lastCard, sortedCards);

    if(consecutivesResult.isAceHighStraight) {
        result.text = `Straight! ${giveNameToValue(secondCard)} to ${giveNameToValue(firstCard)}`;
        result.values = sortedCards;
        result.isAceHighStraight = true;
    }
    else if(consecutivesResult.isStraight) {
        result.text = `Straight! ${giveNameToValue(firstCard)} to ${giveNameToValue(lastCard)}`;
        result.values = sortedCards;
    }
    else {
        result.text = 'No Straight found';
        result.values = 0;
    }

    return result;
}

function checkConsecutives(hasAce, lastCard, sortedCards) {
    let hasConsecutives;
    let result = {
        isAceHighStraight: false,
        isStraight: false,
    }
    if(hasAce) {
        const cardsWithoutAce = [...sortedCards];
        cardsWithoutAce.shift();   
        sortedCardValues = cardsWithoutAce.map(item => { return item.value });
        hasConsecutives = sortedCardValues.filter((item, index) => { return item === sortedCardValues[0] + index; }).length === 4;
    }
    else {
        sortedCardValues = sortedCards.map(item => { return item.value });
        hasConsecutives = sortedCardValues.filter((item, index) => { return item === sortedCardValues[0] + index; }).length === 5;
    }

    if(hasConsecutives) {
        if(hasAce && lastCard === 13) {
            result.isAceHighStraight = true;
        }
        result.isStraight = true;
    }
    return result;
}

function checkFlush(cards) {
    let result = {
        text: '',
        values: 0
    };

    let isFlush = cards.filter(function(item) {
        return item.suit === cards[0].suit;
    }).length === 5;
    
    if(isFlush) {
        result.text = `You have a flush! All ${cards[0].suit}!!`;
        result.values = cards[0].suit;
    } 
    else {
        result.text = 'No Flush found';
    }
    return result;
}

function findHighCard(cards) {
    let highCard;
    let cardValues = cards.map(function(card) {
        return card.value;
    });
    cardValues.sort(function(a, b) {
        return a - b;
    });
    // Ace high
    if(cardValues[0] === 1) {
        return highCard = cardValues[0];
    }
    else {
        return highCard = cardValues[cardValues.length -1];
    }
}

function apostropheOrNot(name) {
    if(typeof name === 'number') {
        return "'s";
    }
    else {
        return "s";
    }
}

function giveNameToValue(value) {
    switch(value) {
        case 1:
            return value = 'Ace';
        case 11: 
            return value = 'Jack';
        case 12:
            return value = 'Queen';
        case 13:
            return value = 'King';
        default: 
            return value;
    }   
}   

function showInPage(cards) {
    let output = 'Your hand: <br><br>';
    let htmlcards = document.querySelector('#cards');
    cards.forEach(function(item) {
        output += `<li> ${item.name} </li>`;
        htmlcards.innerHTML = output;
    });
}

// console.log('Deck length: ', deck.length);
console.log('Five Random Cards -> ', fiveRandomCards);
