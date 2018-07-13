const arr = [1, 1, 3, 9, 3];

function findPairs(arr) {
    let unique = arr.filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
    });
    let numberOfOccurences = [];
    let count = 0;
    let i, j;
    for(j = 0; j < unique.length; j++) {
        for(i = 0; i < arr.length; i++) {
            if(arr[i] === unique[j]) {
                count++;
            }
        }
        numberOfOccurences[j] = `${unique[j]} -> ${count}`;
        count = 0;
    }
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
    
    function showResults(arr) {
        // pair
        if(arr[0]) {
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
    console.log('RESULTS ', showResults(results));

    console.log('hasPair: ', hasPair);
    console.log('hasTwoPair: ', hasTwoPair);
    console.log('countOfPairs: ', countOfPairs);
    console.log('hasThree: ', hasThree);
    console.log('hasFour: ', hasFour);
    console.log('hasNoPair: ', hasNoPair);

    return numberOfOccurences;
}

console.log(findPairs(arr));
