

function generateRandom(min, max, cardsUsed) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return cardsUsed.includes(num) ? generateRandom(min, max, cardsUsed) : num;
}

var test = generateRandom(1, 10,cardsUsed)
console.log(test);