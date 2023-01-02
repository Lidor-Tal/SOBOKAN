'use strict'

const WALL = 'WALL';
const FLOOR = 'FLOOR';
const GAMER = 'GAMER';
const BOX = 'BOX'
const MARK = 'MARKED'
const GLUE = 'GLUE'
const COINS = 'COINS'
const CLOCK = 'CLOCK'

const GAMER_IMG = '<img src="img/gamer.png">'
const BOX_IMG = '<img src="img/box.png">'
const GLUE_IMG = '<img src="img/glue.png">'
const COINS_IMG = '<img src="img/coin.png">'
const CLOCK_IMG = '<img src="img/clock.png">'

var gBoard;
var gGamerPos;

var gScore = 100
var gBoxCount = 7
var gStepCount = 0
var gStepCount = 0
var gStepStop = 10

var gRed = false
var gGreen = false
var gGameIsOn = true
var gIsFrozen = false

var gSpawnGlueInt
var gSpawnCoinsInt
var gSpawnClockInt

function inItGame() {
    if (gSpawnGlueInt) clearInterval(gSpawnGlueInt)
    if (gSpawnCoinsInt) clearInterval(gSpawnCoinsInt)
    if (gSpawnClockInt) clearInterval(gSpawnClockInt)

    gGamerPos = { i: 2, j: 2 }
    gBoard = buildBoard()
    renderBoard(gBoard)

    gSpawnClockInt = setInterval(spawnClock, 10000)
    gSpawnGlueInt = setInterval(spawnGlue, 10000)
    gSpawnCoinsInt = setInterval(spawnCoins, 10000)
}

function buildBoard() {
    var board = createMat(9, 9)


    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameElement: null };

            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            board[i][j] = cell;
        }
    }


    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    board[3][4].gameElement = BOX
    board[2][3].gameElement = BOX
    board[4][4].gameElement = BOX
    board[6][3].gameElement = BOX
    board[6][4].gameElement = BOX
    board[6][5].gameElement = BOX
    board[6][1].gameElement = BOX

    board[2][1].type = 'MARKED'
    board[3][6].type = 'MARKED'
    board[4][1].type = 'MARKED'
    board[5][4].type = 'MARKED'
    board[7][4].type = 'MARKED'
    board[5][6].type = 'MARKED'
    board[6][3].type = 'MARKED'

    board[1][0].type = 'WALL'
    board[1][1].type = 'WALL'
    board[1][2].type = 'WALL'
    board[1][7].type = 'WALL'
    board[2][7].type = 'WALL'
    board[3][7].type = 'WALL'
    board[4][7].type = 'WALL'
    board[3][0].type = 'WALL'
    board[3][1].type = 'WALL'
    board[3][2].type = 'WALL'
    board[4][2].type = 'WALL'
    board[5][2].type = 'WALL'
    board[4][3].type = 'WALL'

    return board
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })
            if (currCell.type === FLOOR) {
                cellClass += ' floor'
            }
            if (currCell.type === WALL) {
                cellClass += ' wall'
            }
            if (currCell.type === MARK) {
                cellClass += ' marked'
            }

            // cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall'

            // /TODO - Change To template string
            strHTML += `\t<td class="cell ${cellClass}" 
			onclick="moveTo(${i},${j})" >\n`
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG;
                    break
                case BOX:
                    strHTML += BOX_IMG
                    break


            }



            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function moveTo(i, j) {
    if (!gGameIsOn) return
    if (gIsFrozen) return

    var targetCell = gBoard[i][j];
    var currI = i
    var currJ = j
    // If the clicked Cell is one of the four allowed
    var iAbsDiff = (i - gGamerPos.i);
    var jAbsDiff = (j - gGamerPos.j);
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)
        || (iAbsDiff === -1 && jAbsDiff === 0) || (jAbsDiff === -1 && iAbsDiff === 0)) {
        if (targetCell.type === WALL) return;

        if (targetCell.gameElement === BOX) {
            if (gBoard[i + iAbsDiff][j + jAbsDiff].gameElement === BOX) return
            if (gBoard[i + iAbsDiff][j + jAbsDiff].type === WALL) return;
            //MODEL:

            gBoard[i][j].gameElement = null
            //Dom:

            renderCell({ i: currI, j: currJ }, '')
            //MOVING to selected position

            currI = i + iAbsDiff
            currJ = j + jAbsDiff
            //MODEL:

            gBoard[currI][currJ].gameElement = BOX
            //Dom:

            renderCell({ i: currI, j: currJ }, BOX_IMG)
            boxOnMarkedCell(currI, currJ)

        }
        if (targetCell.gameElement === GLUE) {
            console.log('oops')
            gIsFrozen = true
            gScore + 5
            gRed = true
            setTimeout(() => {
                gIsFrozen = false
            }, 3000)
        } else if (targetCell.gameElement === COINS) {
            console.log('MONEYYYY')
            gGreen = true
            gScore + 100
            var elScore = document.querySelector('.score')
            elScore.innerHTML = gScore
        } else if (targetCell.gameElement === CLOCK) {
            console.log('TIME STOPPED')
            gStepStop = 0

        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);
        if (gRed === true) {
            const elCell = getClassName(gGamerPos)
            var cell = document.querySelector('.' + elCell)
            cell.classList.remove('green')
            cell.classList.add('red')
        }
        if (gGreen === true) {
            const elCell = getClassName(gGamerPos)
            var cell = document.querySelector('.' + elCell)
            cell.classList.remove('red')
            cell.classList.add('green')
        }
        stepCount()
        checkifWin()
    }
}

function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}

function stepCount() {
    if (gStepStop >= 10) {
        gScore--
        gStepCount++
        var elScore = document.querySelector('.score')
        elScore.innerHTML = gScore
        var elStep = document.querySelector('.steps')
        elStep.innerHTML = gStepCount
        return
    }
    gStepStop++
}

function boxOnMarkedCell(i, j) {
    var currCell = gBoard[i][j].type
    if (currCell === 'MARKED') {
        gBoxCount--
        checkifWin()
    }
}

function checkifWin() {
    if (gBoxCount === 0) OnWin()
    if (gStepCount === 60) OnLoose()
}

function OnLoose() {

    gGameIsOn = false
    document.querySelector('.gameover').style.display = 'block'
}

function OnWin() {

    gGameIsOn = false
    document.querySelector('.gamewon').style.display = 'block'
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function restartGame() {

    clearInterval(gSpawnGlueInt)
    clearInterval(gSpawnCoinsInt)
    document.querySelector('.gameover').style.display = 'none'
    document.querySelector('.gamewon').style.display = 'none'
    gStepCount = 0
    gScore = 100
    gBoxCount = 7
    var elSteps = document.querySelector('.steps')
    elSteps.innerHTML = gStepCount
    var elScore = document.querySelector('.score')
    elScore.innerHTML = gScore
    gGameIsOn = true
    inItGame()
}

function spawnGlue() {
    var cell = getEmptyCells(gBoard)
    gBoard[cell.i][cell.j].gameElement = GLUE
    renderCell(cell, GLUE_IMG)
    removeElement(cell.i, cell.j, 5000)
}
function spawnCoins() {
    var cell = getEmptyCells(gBoard)
    gBoard[cell.i][cell.j].gameElement = COINS
    renderCell(cell, COINS_IMG)
    removeElement(cell.i, cell.j, 5000)
}

function spawnClock() {
    var cell = getEmptyCells(gBoard)
    gBoard[cell.i][cell.j].gameElement = CLOCK
    renderCell(cell, CLOCK_IMG)
    removeElement(cell.i, cell.j, 5000)

}