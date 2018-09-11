const keyboardConstant = {
    ENTER: 13,
    SPACE: 32,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
}

function changeRocketPosition() {
    //All these varible bellow is used to make the condition of the if else statement easier to read 
    //
    //Direction of the rocket
    var rocketGoUp = rocket.heightIncrement < 0;
    var rocketGoDown = rocket.heightIncrement > 0;
    var rocketGoLeft = rocket.widthIncrement < 0;
    var rocketGoRight = rocket.widthIncrement > 0;

    //Condition if rocket hits any wall
    var rocketHitRightWall = dimensionShip.HEIGHT + rocket.x >= innerWidth;
    var rocketHitLeftWall = rocket.x  <= 4;             //4 pixels so the left wing of the ship doesn't go out of screen
    var rocketHitTopWall = rocket.y <= 0;
    var rocketHitBottomWall = (rocket.y + dimensionShip.WIDTH) >= (innerHeight);

    if (rocketGoLeft || rocketGoRight) {
        if (rocketGoLeft && !rocketHitLeftWall) {
            rocket.x += rocket.widthIncrement * 7;
        } else if (rocketGoRight && !rocketHitRightWall) {
            rocket.x += rocket.widthIncrement * 7;
        }
    }
    else if (rocketGoUp || rocketGoDown) {
        if (rocketGoUp && !rocketHitTopWall){
            rocket.y += rocket.heightIncrement * 7;
        }
        else if (rocketGoDown && !rocketHitBottomWall) {
            rocket.y += rocket.heightIncrement * 7;
        }
    }
    rocket.position(rocket.x, rocket.y);
    rocket.heightIncrement = 0;
    rocket.widthIncrement = 0;
}

var handleKeyPress = function (event) {
    switch (event.keyCode) {
        case keyboardConstant.UP_ARROW:
            rocket.heightIncrement = -1;
            break;
        case keyboardConstant.DOWN_ARROW:
            rocket.heightIncrement = 1;
            break;
        case keyboardConstant.RIGHT_ARROW:
            rocket.widthIncrement = 1;
            break;
        case keyboardConstant.LEFT_ARROW:
            rocket.widthIncrement = -1;
            break;
        default: break; //No default
    }

    if (!hasTheGameFinished) {
        changeRocketPosition();
    }
};

window.addEventListener('keydown', handleKeyPress);