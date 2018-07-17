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
    // fiveCards.push(deck[40]);
    // fiveCards.push(deck[44]);
    // fiveCards.push(deck[48]);
    // [PREDETERMINED HAND - FOUR OF A KIND]
    // fiveCards.push(deck[0]);
    // fiveCards.push(deck[1]);
    // fiveCards.push(deck[2]);
    // fiveCards.push(deck[3]);
    // fiveCards.push(deck[10]);
    
    return fiveCards;
}

function contains(item, array) {
    const index = array.indexOf(item);
    if(index >= 0) {
        return true;
    }
    return false;
}

// Check hand ranking
// function checkHand(cards) {
//     let rank = checkPairs(cards);
//     console.log(' RANK -> ' , rank)
//     if(rank === 'No Pair found') {
//         rank = checkStraightAndFlush(cards);
//         if(rank === 'No Straight or Flush found') {
//             let largest = cards.sort(function(a, b) {
//                 return a.value-b.value;
//             });
//             // ACE
//             if(largest[0].value === 1) {
//                 largest = cards[0];
//             }
//             else {
//                 largest = cards[cards.length - 1];
//             }
//             rank = largest.name.split(' ')[0] + ' High';
//         }
//     }
//     return rank;
// }

// checkhand rewrite
function checkHand(cards) {
    let rank = '';
    
    let straightResult;
    let flushResult;
    let pairResult;

    straightResult = checkStraight(cards);
    flushResult = checkFlush(cards);
    pairResult = checkPairs(cards);
    
    // Determine hand ranking to show in page. Will remake
    let arr = [];
    arr.push(straightResult, flushResult, pairResult);
    arr = arr.filter(function(a) {
        return a.values != 0;
    })

    if(arr.length === 0) {
        rank = 'Nothing';
    }
    else {
        rank = arr[0].text;
    };

    console.log('Pair: ', pairResult);
    console.log('Straight: ', straightResult);
    console.log('Flush: ', flushResult);
    
    // Straight Flush combos
    if(straightResult.values != 0 && flushResult.values != 0) {
        console.log('Straight Flush!!');
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
    })
    
    console.log('PAIRS: ', pairs);
    console.log('NUMBER OF OCCURENCES: ', numberOfOccurences);
    
    const result = getResult(pairs);

    // Get hand ranking and respective values
    function getResult(pairs) {
        let result = {
            text: '',
            values: []
        };
        // One Pair / Three of a kind / Four of a kind
        if(pairs.length === 1) { 
            let firstNamedValue = giveNameToValue(pairs[0].value);   
            // One pair
            if(pairs[0].count === 2) {
                result.text = `One pair! ${firstNamedValue}${apostropheOrNot(firstNamedValue)}`;
                result.values = pairs[0].value;
            }
            // Three of a kind
            else if(pairs[0].count === 3) {
                result.text = `Three of a kind! ${firstNamedValue}${apostropheOrNot(firstNamedValue)}`;
                result.values = pairs[0].value;
            }
             // Four of a kind
             else if(pairs[0].count === 4) {
                result.text = `Four of a kind! ${firstNamedValue}${apostropheOrNot(firstNamedValue)}`;
                result.values.push(pairs[0].value);
            }
        }
        // Two Pair / Full House
        else if(pairs.length === 2) {
            let firstNamedValue = giveNameToValue(pairs[0].value);
            let secondNamedValue = giveNameToValue(pairs[1].value);
            // Two Pair
            if(pairs[0].count === 2 && pairs[0].count === 2) {
                result.text = `Two Pair! ${firstNamedValue}${apostropheOrNot(firstNamedValue)} and ${secondNamedValue}${apostropheOrNot(secondNamedValue)}`;
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

    console.log('LASTCARD ', lastCard);
    console.log('SECONDCARD ', secondCard);
    console.log('FIRSTCARD ', firstCard);
    const result = {
        text: '',
        values: []
    }

    // Special case: Ace High Straight
    if((lastCard === 13) && (secondCard === 10) && (firstCard === 1)) {
        result.text = `Straight! ${giveNameToValue(secondCard)} to ${giveNameToValue(firstCard)}`;
        result.values = sortedCards;
    } 
    // If straight, [last value - first value === 4] (in sorted array)
    else if(lastCard - firstCard === 4) {
        result.text = `Straight! ${giveNameToValue(firstCard)} to ${giveNameToValue(lastCard)}`;
        result.values = sortedCards;
    }
    else {
        result.text = 'No Straight found';
        result.values = 0;
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
