//game constants
const X_CLASS = 'X';
const CIRCLE_CLASS = 'O';
const WINNING_COMBOS = [
    [0,1,2,],
    [3,4,5,],
    [6,7,8],
    [0,3,6,],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
let circleTurn = false


//html elements
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
const statusDiv = document.querySelector('.status')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')

startGame ()

function startGame () {
    circleTurn = false;
    //reset statusDiv
    statusDiv.innerText = statusDiv.textContent = "X is next"
    // loop through each cell 
    cellElements.forEach(cell => {
        
        //clear cells
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        //remove event listener
        cell.removeEventListener('click', handleClick)
        // every time we clcik on cell we want to use (handleClcik) and only ever fire this eventlistener once //same cell can't be clicked twice
        cell.addEventListener('click', handleClick, {once: true})
    })

    setHoverClass()

    winningMessageElement.classList.remove('show')
}

// what happens when we click the cell 
function handleClick (e) {
    // the cell we clicked on 
    const cell = e.target 
    // if its circle circleTurn, we return CIRCLE_CLASS, otherwise return xClass 
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

    //place symbol
    placeSymbol(cell, currentClass)

    //check for win
    if (checkWin(currentClass)) {
        endGame(false)
    }
    //check for draw
    else if (isDraw()) {
        endGame(true)
    }
    else {
        //switch turns
        switchTurns()

        //set hover effects
        setHoverClass()

        statusDiv.innerHTML = currentClass + " is next"
    }
    
    
}

//display winner on new screen when game is done
function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
    }
    else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
    }

    winningMessageElement.classList.add('show')
}

function isDraw () {
    // if every single cell ...
    //destructure cellElements so that it has .every method
    return [...cellElements].every(cell => {
        // ...contains an 'x' or 'o', then return true
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}


function placeSymbol(cell, currentClass) {
    cell.classList.add(currentClass)
}

function switchTurns () {
    circleTurn = !circleTurn
}

function setHoverClass () {
    // cleaar classses 
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS)

    // if circles turn, add circle class
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    }
    //else it's x turn, add x class
    else {
        board.classList.add(X_CLASS)
    }
}

function checkWin (currentClass) {
    
    // statusDiv.innerHTML = currentClass + " is next"
    
    //return true if any of the values inside of it are true  // this will loop over all of the combinations
    return WINNING_COMBOS.some(combination => {
        // for each one of the combinations, we want to check if all the indexes have the same class (x or circle)
        return combination.every(index => {
            //check each cell. if the current class is on all three elements inside combination, then we are winner
            return cellElements[index].classList.contains(currentClass)
        })
    })     
}


//every time we click on restart button, we want to call startGame function
restartButton.addEventListener('click', startGame)


















