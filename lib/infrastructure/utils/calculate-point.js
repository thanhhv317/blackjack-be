

const calculatePoint = (cards) => {
    let point = 0;
    point = cards.reduce((a, b) => {
        return a + b.value[0]
    }, 0)
    return point > 21 ? -1 : point;
}


module.exports = calculatePoint;