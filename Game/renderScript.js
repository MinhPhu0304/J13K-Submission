const dimensionMeteor = {
    HEIGHT: 165,
    WIDTH: 148
};
const dimensionShip = {
    HEIGHT: 60,
    WIDTH: 90
}

const meteorSizeInGame = {
    height: 80,
    width : 80
};
const numberMeteor = 15;                    //If you want the game to be harder just change the number of meteors. Good luck trying to avoid more than 15 meteors

var hasTheGameFinished = false;
var isTheGamePaused = false;

//create new game with page height and page width canvas size
var Game = new mibbu(innerWidth, innerHeight);

//uncomment line below for disabling 
//
Game.showScore()             
    .canvasOff()        //comment this line for disabling canvas and swiching to DOM rendering
    //.cssAnimationOff()//uncomment this in DOM mode to disable CSS3 Animations (only in webkit & Firefox Beta browsers)     
    .init()             //now init all the elements - before calling 

var rocket = new Game.spr('img/ship2.png', dimensionShip.HEIGHT, dimensionShip.WIDTH, 0, 0),
    //create new background using background.jpg file and set it's speed
    //to 10, direction to NORTH, and initial position to (0,0)
    background = new Game.bg('img/background.png', 10, "N", { x: 0, y: 0 });

var meteorArray = new Array();

//Setting up meteors array
meteorArray.init = function setUpMeteor() {
    for (var i = 0; i < numberMeteor; i++) {
        meteorArray.push(new Game.spr('img/meteor.png', meteorSizeInGame.height, meteorSizeInGame.width, 0, 0));
        meteorArray[i].x = Math.random() * innerWidth;
        meteorArray[i].y = (Math.random() * (innerHeight)) - innerHeight;
        meteorArray[i].size(meteorSizeInGame.height, meteorSizeInGame.width);
        meteorArray[i].movingSpeed = Math.random() * 6 + 1;
    }
}

//setting speed of rocket animation
//Other field is used for control movement of the rocket
rocket.speed(0).position(400, 300, 1);
rocket.y = 300;
rocket.x = 400;
rocket.heightIncrement = 0;
rocket.widthIncrement = 0;

//start moving background
//With the current setting the background is moving at a random speed to the South
background.speed(10).dir("S").on();

meteorArray.init();
//start main game loop
Game.on();

//now we will create additional function
//to be called on each frame of main game loop
var additionalLoop = function () {
    renderMeteorArray();    //The function constains loop to rerender each meteor in the array
    checkHit();  

    let currentScore = userScore.getMeteorAvoided();
    Game.changeText(currentScore);
}

//renderMeteorArray will be called at each frame to change the location of each meteors
//Also if the meteor goes out of screen it will rerender at random location 
//variable isTheGamePaused is used to stop render meteor when the tab is not focused
function renderMeteorArray() {
    if (!isTheGamePaused) {

        for (var i = 0; i < numberMeteor; i++) {
            if (meteorArray[i].y > innerHeight) {
                meteorArray[i].x = Math.random() * (innerWidth - meteorSizeInGame.width);   
                meteorArray[i].y = 0 - Math.random() * (innerHeight / 2);                   //Each meteor will be moved into new position
                                                                                            //  before the top wall    

                meteorArray[i].movingSpeed = Math.random() * 5 + 1;     //Change its speed after it goes out of the screen 

                
                if (meteorArray[i].movingSpeed >= 4) {
                    meteorArray[i].change('img/fire.png', meteorSizeInGame.height, meteorSizeInGame.width, 0, 0);
                }
                else {
                    meteorArray[i].change('img/meteor.png', meteorSizeInGame.height, meteorSizeInGame.width, 0, 0);
                }

                userScore.addMeteorAvoided();

            } else {
                meteorArray[i].y += meteorArray[i].movingSpeed;
                meteorArray[i].position(meteorArray[i].x, meteorArray[i].y);
            }
        }
    }
}

//now add that function to the loop
//and start checking for the collisions
Game.hook(additionalLoop).hitsOn();

//In the the function bellow each object will be called and call hit method
function checkHit() {
    for (var i = 0; i < numberMeteor; i++) {

        meteorArray[i].hit(rocket, function () {

            rocket.change('img/explode.png', 80, 80, 3, 0);
            rocket.size(120, 120);
            rocket.speed(0);                               //Not necessary but I'm too afraid to delete it

            hasTheGameFinished = true;                     //This variable is used to stop the rocket move atfer game ends

            Game.off();                                    //Turn of game engine so it will stop render meteor and background image
            setTimeout(function () { promptUserPlayAgain() }, 500);        //Dirty hack to get the object render before alert box

        });

    }  
}

function promptUserPlayAgain() {

    alert("Game over, you have avoided " + userScore.getMeteorAvoided() + " meteors");
    var userPlayAgain = confirm("Do you want to play again?");

    if (userPlayAgain) {
        Game.resetScoreText();
        userScore.resetScore();
        resetGameState();
    }
}

function resetGameState() {
    meteorAvoided = 0;
    hasTheGameFinished = false;

    rocket.x = Math.random() * (innerWidth - dimensionShip.WIDTH);                      //Reset rocket position into new random position 
    rocket.y = innerHeight - dimensionShip.WIDTH;
    rocket.change('img/ship2.png', dimensionShip.HEIGHT, dimensionShip.WIDTH, 0, 0);    //The rocket already explode LOL, so  we have to change the picture again

    for (var i = 0; i < numberMeteor; i++) {
        meteorArray[i].x = Math.random() * innerWidth;
        meteorArray[i].y = (Math.random() * (innerHeight / 2)) - innerHeight;
        meteorArray[i].position(meteorArray[i].x, meteorArray[i].y);
    }
    rocket.position(rocket.x, rocket.y);
    Game.on();                                              //Turn on and off is the best way I could think so far

}

function handleVisibilityChange() {
    if (document.hidden) {
        isTheGamePaused = true;         //quite bad solution but this is what I could think of so far
        background.off();
    }
    else {
        isTheGamePaused = false;
        background.on();
    }
}

window.addEventListener("visibilitychange", handleVisibilityChange, false);
