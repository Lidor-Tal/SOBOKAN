function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].type === FLOOR && gBoard[i][j].gameElement === null) {
                emptyCells.push({ i, j })
            }
        }
    }
    if (emptyCells.length === 0) OnLoose()
    var randCell = emptyCells[getRandomInt(0, emptyCells.length)]
    return randCell
}

function removeElement(i, j, timer) {
    setTimeout(() => {
        if (gBoard[i][j].gameElement === GAMER) return
        gBoard[i][j].gameElement = null
        renderCell({ i, j }, '')
    }, timer)

}