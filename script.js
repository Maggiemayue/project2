const height = 6;
const width = 5;

var row = 0;
var col = 0;

var gameOver = false;
// var words = ["HELLO", "ABOUT", "APPLE"]; //array 
// var word = "HELLO";

// var randomWord = words[Math.floor(Math.random() * words.length)];
// console.log(randomWord);

//API code
async function fetchWord() {
    const url = 'https://random-words5.p.rapidapi.com/getRandom?wordLength=5';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c3dc837761msh5b72cd4112d6a7ap1650dajsnb8a7b41e64ee',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        //console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

window.onload = function(){
    initialize();
    document.getElementById('restartButton').addEventListener("click", restartGame);
}

async function initialize(){
    // word = randomWord;
    word = await fetchWord();
    word = word.toUpperCase();
    console.log(word);

    // Creats the board
    for (let r = 0; r < height; r++){
        for (let c = 0; c < width; c++){
            let cell = document.createElement("div");
            cell.id = r.toString() + "-" + c.toString();
            cell.classList.add("cell");
            // const list = element.classList;
            // list.add("cell");
            cell.innerText = "";
            document.getElementById("board").appendChild(cell);

        }
    }

    

    //Listen for key press
    document.getElementById('button').addEventListener("click", (e)=>{
        if (gameOver) return;


        
        const guessInput = document.getElementById('guess');
        const input = guessInput.value.toUpperCase(); 

        
        if (input.length !== 5) {
            alert('Error: Please enter a 5-letter word.');
        } else {
            // input.split('').forEach((letter, index) => {
                //const cell = document.getElementById(`0-${index}`);  
                input.split('').forEach((letter, index) => {
                const cell = document.getElementById(row.toString() + '-' + index.toString());

                cell.innerText = letter;
            });

            guessInput.value = ''; 
            update();
            
            row += 1; //start new rows
            col = 0; //start at 0 for new row
        }


        if (!gameOver && row == height){
            gameOver = true;
            alert(`Sorry you did not win this time. The answer was ${word}.`);
            document.getElementById('restartButton').disabled = false; 
        }
    })
}

function update(){
    let correct = 0;
    let letterCount = {}; 
    for (let i = 0; i < 5; i++){
        
        letter = word[i];
        if (letterCount[letter]){
            letterCount[letter] += 1;
        }else{
            letterCount[letter] = 1;
        }
    }

    //first iteration, check all the correct ones
    for (let c = 0; c < width; c++){
        const cell = document.getElementById(row.toString() + '-' + c.toString());
        let letter = cell.innerText;

        // // Clear previous status classes
        // cell.classList.remove("correct", "present", "absent");

        //Is it in the corerect position?
        if (word[c] == letter){
            cell.classList.add("correct");
            correct += 1;
            letterCount[letter] -=1;
        } 

        if (correct == width){
            gameOver = true;
            alert('Yay! You win!');
            document.getElementById('restartButton').disabled = false;
        }
    }

    //go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++){
        const cell = document.getElementById(row.toString() + '-' + c.toString());
        let letter = cell.innerText;

        // // Clear previous status classes
        // cell.classList.remove("correct", "present", "absent");

        if (!cell.classList.contains("correct")){
            //Is it in the word?
            if (word.includes(letter) && letterCount[letter] > 0){
                cell.classList.add("present");
                letterCount[letter] -= 1;
            }//not in the word
            else{
                cell.classList.add("absent");
            }
        }
    }
}

function restartGame() {
    // Reset variables
    row = 0;
    col = 0;
    gameOver = false;

    // Clear the board
    const board = document.getElementById('board');
    // while (board.firstChild) {
    //     board.removeChild(board.firstChild);
    // }
    board.innerHTML = '';


    // Disable the restart button
    document.getElementById('restartButton').disabled = true;
    // Optionally fetch a new word
    initialize();
}


