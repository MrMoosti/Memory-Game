/* Memory Game */

let memoryCardParent = document.getElementById("memoryCardParent");

let cardsClicked = 0;
let previousCardClicked = null;

let hasFlippedTwoCardsAlready = false;

// SCORE SYSTEM //
let lives = 5;
let time = 0;
let username = "John Doe";
let score = 0;
// SCORE SYSTEM //

// HIGHSCORE SYSTEM //
let highscore = [];
let storedData = localStorage.getItem("highscore");
if (storedData) {
    highscore = JSON.parse(storedData);
} 
// HIGHSCORE SYSTEM //

/* MEMORY CARDS */
//Max is 8
let cards = ["google", "google", 
                "twitch", "twitch", 
                "nintendo-switch", "nintendo-switch", 
                "youtube", "youtube", 
                "instagram", "instagram",
                "facebook", "facebook",
                "whatsapp", "whatsapp",
                "linkedin", "linkedin"
                ];

function generateCards(amount) {
    if(amount > 16) {
        console.log("Maximum of cards that you can create is 16!");
    }
    else {
        let currentCardsAvailable = cards;
        console.log(currentCardsAvailable);
        console.log(cards);

        let row = 0;
        let column = 0;
        for(let i = 1; i <= amount; i++)
        {
            if(column == 4) {
                column = 0;
                row++;
            }
    
            let card = document.createElement("div");
            card.setAttribute("id", "r-" + row + "-c-" + column);
            card.setAttribute("class", "memory-card");
            card.setAttribute("onclick", "cardClickedListener(this)")
    
            let cardContent = document.createElement("i");

            let randomPickedNumber = Math.floor(Math.random()*currentCardsAvailable.length);
            let randomCardPicked = currentCardsAvailable[randomPickedNumber];
            currentCardsAvailable.splice(randomPickedNumber, 1);
            cardContent.setAttribute("class", "fab fa-"+ randomCardPicked +" memory-card-item");
            cardContent.style.color = "rgba(232, 232, 232, 0)";
    
            card.appendChild(cardContent);
            memoryCardParent.appendChild(card);
    
            column++;
        }
    }
}

function cardClickedListener(element)
{
    if(!hasFlippedTwoCardsAlready) {
        cardsClicked++;
    
        if(cardsClicked === 1) {
            previousCardClicked = element;
    
        }
        
        element.childNodes[0].style.color = "rgba(232, 232, 232, 1)";
        changeCardColor(element, "green");
    
        if(cardsClicked === 2) {
            checkIfCardsAreSame(element, previousCardClicked);
        }
    }
}

function checkIfCardsAreSame(current, previous) {
    let currentIcon = current.childNodes[0].className.toString();
    let previousIcon = previous.childNodes[0].className.toString();
    
    currentIcon = currentIcon.replace("fab fa-", "").replace("memory-card-item", "");
    previousIcon = previousIcon.replace("fab fa-", "").replace("memory-card-item", "");

    if(currentIcon !== previousIcon)
    {
        changeCardColor(current, "red");
        changeCardColor(previous, "red");
        if(lives <= 0) {
            console.log("You are dead!");
            checkScoreForHighScore();
        } else {
            updateLives(-1);
            if(lives <= 0) {
                console.log("You are dead!");
                checkScoreForHighScore();
            }
        }
        
        hasFlippedTwoCardsAlready = true;

        let flipcards =  setTimeout(function() {
            changeCardColor(current, "");
            changeCardColor(previous, "");
            hasFlippedTwoCardsAlready = false;
        }, 2000);

    } else {
        current.removeAttribute("onclick");
        previous.removeAttribute("onclick");
        updateScore(50);
    }
    cardsClicked = 0;
}

function changeCardColor(element, color)
{
    if(color == null || color == "") {
        element.style.backgroundColor = "";
        element.childNodes[0].style.color = "";
    } else if(color == "green") {
        element.style.backgroundColor = "#00a344";
    } else if(color == "red") {
        element.style.backgroundColor = "#cc3333";
    }
}

function resetCards() {
    while (memoryCardParent.firstChild) {
        memoryCardParent.removeChild(memoryCardParent.firstChild);
    }
}

function restartGame() {
    resetCards();
    lives = 5;
    time = 0;
    username = "John Doe";
    score = 0;
    cardsClicked = 0;
    previousCardClicked = null;
    hasFlippedTwoCardsAlready = false;
    cards = ["google", "google", 
                "twitch", "twitch", 
                "nintendo-switch", "nintendo-switch", 
                "youtube", "youtube", 
                "instagram", "instagram",
                "facebook", "facebook",
                "whatsapp", "whatsapp",
                "linkedin", "linkedin"
                ];
    updateLives(0);
    updateScore(0);
    startTimer();
    displayHighScore();
    generateCards(16);
}
/* MEMORY CARDS */


/* OWN SCORE SYSTEM */
function updateLives(amount)
{
    lives += amount;
    document.getElementById("current-lives").innerText = lives;
}

function updateScore(amount) {
    score += amount;
    document.getElementById("current-score").innerText = score;
}

function startTimer()
{
    let minutes = null;
    let seconds = null;
    let timer = setInterval(function() {
        time++;
        minutes = Math.floor(time / 60);
        seconds = time - minutes * 60;

        if(minutes < 10 && seconds < 10) {
            document.getElementById("current-time").innerText = "0" + minutes + ":" + "0" + seconds;
        } else if(minutes < 10 && seconds >= 10) {
            document.getElementById("current-time").innerText = "0" + minutes + ":" + seconds;
        } else {
            document.getElementById("current-time").innerText = minutes + ":" + seconds;
        }

        if(lives <= 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function setUsername(name) {
    username = name;
}
/* OWN SCORE SYSTEM */


/* HIGH SCORE */
function checkScoreForHighScore() {
    if(highscore == null) {
        username = prompt("Fill in a username", "John Doe");

        let user = {"name":username, "score": score};
        highscore.push(user);

        localStorage.setItem("highscore",  JSON.stringify(highscore));
    } else {
        if(highscore.length == 5) {
            console.log("Length is 5");
            for(let i = 0; i < highscore.length; i++) {
                if(score > highscore[i].score) {
                    username = prompt("Fill in a username", "John Doe");
                    let user = {"name":username, "score":score};
                    let index = highscore.indexOf(highscore[i].score);

                    highscore.splice(index, 1);
                    highscore.push(user);

                    highscore.sort(function(a, b){return b.score-a.score});

                    saveHighScore();
                    break;
                }
            }
        } else {
            username = prompt("Fill in a username", "John Doe");
            let user = {"name":username, "score":score};
            highscore.push(user);
            highscore.sort(function(a, b){return b.score-a.score});
            saveHighScore();
        }
    }
    restartGame();
}

function saveHighScore() {
    localStorage.setItem("highscore",  JSON.stringify(highscore));
    displayHighScore();
    console.log(highscore);
}

function displayHighScore()
{
    let real_highscore = localStorage.getItem("highscore");

    if(real_highscore) {
        real_highscore = JSON.parse(storedData);

        real_highscore.forEach(user => {
            let highscoreToDisplay = real_highscore.indexOf(user) + 1 + ". " + user.name + " (" + user.score + ")";
            document.getElementById(real_highscore.indexOf(user)).innerText = highscoreToDisplay;
        });
    }
}
/* HIGH SCORE */

generateCards(16);
updateLives(0);
updateScore(0);
startTimer();
displayHighScore();
