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
let circleTurn = false;
let gameIsLive = true;
const player = new Object;
let OPPONENT;

//DOM elements
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
const statusDiv = document.querySelector('.status')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const nameButton = document.getElementById('submitNames')
const computerBtn = document.querySelector(".computer");
const friendBtn = document.querySelector(".friend");
const options = document.querySelector(".options");

// =========== START THE GAME / RESET ==========
function startGame () {
    
    gameIsLive = true;
    circleTurn = false;
    //reset statusDiv
    statusDiv.innerText = capitalizeFirstLetter(player1.value) + " is next"
    // clear input 
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
    //add hover effects
    setHoverClass();
    //hide winning result message
    winningMessageElement.classList.remove('show');

}

//========= RENDER PLAYER ==========
const renderPlayer = (currentClass) => {
    let text;
    //if current class is x, show player1 name
    if (currentClass === X_CLASS) {
        text = capitalizeFirstLetter(player1.value) + " is next"
    }
    //else if current class is o, show player2 name
    else {
        text = "<span>" + capitalizeFirstLetter(player2.value) + " is next</span>"
    }
  // whatever we've decided the text should be, now set it on the element
  statusDiv.innerHTML = text;
}
//========== CAPITALIZE NAME ============
function capitalizeFirstLetter(player) {
    const capitalizedName = player.charAt(0).toUpperCase() + player.slice(1);
    return capitalizedName
}
  
// ========== WHAT HAPPENS WHEN WE CLICK CELL ==========
function handleClick (e) {
    // the cell we clicked on 
    const cell = e.target 
    // if its circle circleTurn, we return CIRCLE_CLASS, otherwise return xClass 
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    
    //place symbol
    placeSymbol(cell, currentClass)

    //check for win
    if (checkWin(currentClass) || gameIsLive) {
        endGame(false)
    }
    //check for draw
    else if (isDraw()) {
        endGame(true)
    }
    else {
        //switch turns
        switchTurns()
        //get player name
        renderPlayer(currentClass)
        //set hover effects
        setHoverClass()
    }
}

//========== DISPLAY WINNER ON NEW SCREEN WHEN GAME IS DONE ===========
function endGame(draw) {
    gameIsLive = false;
    if (draw) {
        winningMessageTextElement.innerText = 'Game is tied!'
    }
    else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
    }
    //display message
    winningMessageElement.classList.add('show')
}

//========== GAME TIED ==========
function isDraw () {
    gameIsLive = false;
    // if every single cell ...
    //destructure cellElements so that it has .every method
    return [...cellElements].every(cell => {
        // ...contains an 'x' or 'o', then return true
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

//====== CHECK WINNER ======
function checkWin (currentClass) {
    gameIsLive = false;
    //return true if any of the values inside of WINNING_COMBOS are true  // this will loop over all of the combinations
    return WINNING_COMBOS.some(combination => {
        // for each one of the combinations, we want to check if all the indexes have the same class (x or circle)
        return combination.every(index => {
            //check each cell. if the current class is on all three elements inside combination, then we are winner
            return cellElements[index].classList.contains(currentClass)
        })
    })     
}

//====== ADD X OR O ======
function placeSymbol(cell, currentClass) {
    cell.classList.add(currentClass)
}

//======== SWITCH PLAYER TURN ========
function switchTurns () {
    circleTurn = !circleTurn
}

//====== HOVER EFFECTS ======
function setHoverClass () {
    // cleaar classses 
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS)

    // if circles turn is true, add x class
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    }
    //else it's x turn, add x class
    else {
        board.classList.add(X_CLASS)
    }
}

//every time we click on restart button, we want to call startGame function
//=========== RESET BUTTON ===========
restartButton.addEventListener('click', startGame)

//=========== COMPUTER BUTTON ===========
computerBtn.addEventListener("click", function(){
    OPPONENT = "computer";
    switchActive(friendBtn, computerBtn);
});

//=========== FRIEND BUTTON ===========
friendBtn.addEventListener("click", function(){
    OPPONENT = "friend";
    switchActive(computerBtn, friendBtn);
});

//=========== SUBMIT NAME BUTTON ===========
nameButton.addEventListener("click", function(){
    
    if ( player1.value === '' || player2.value === ''){
        statusDiv.innerHTML = ` PLEASE ENTER NAME
        <style>
        div .status {color: #993301;}
        </style>`
    }
    else {
        startGame()
    }
});

function switchActive(off, on){
    off.classList.remove("active");
    on.classList.add("active");
}
