"use strict";

function Color(jQ, on, off) {
    this.element = jQ;
    this.colorOn = function() {
        jQ.css("background-color", on);
    };
    this.colorOff = function () {
        jQ.css("background-color", off);
    };
}

function SimonSound(el) {
    this.element = el;
    this.play = () => {
        el.play();
    };
    this.stop = () => {
        el.pause();
        el.currentTime = 0;
    };
}

function Game() {
	//Strict's display handled depending on strict
    var strictDisplay = $("#strict-display");

    //Turn display
    var turnDisplay = $("#turn-display");

	//Define color objects
	var green = new Color($("#green"), "#13ff7c", "#00a74a");
    var red = new Color($("#red"), "#ff4c4c", "#9f0f17");
    var yellow = new Color($("#yellow"), "#fed93f", "#cca707");
    var blue = new Color($("#blue"), "#1c8cff", "#094a8f");
    var mainButtons = $(".main-button");

	//Retrieve audio objects
    var gsound = new SimonSound(document.getElementById("gsound"));
    var rsound = new SimonSound(document.getElementById("rsound"));
    var ysound = new SimonSound(document.getElementById("ysound"));
    var bsound = new SimonSound(document.getElementById("bsound"));

    //Define flavor symbols
    const CHECKMARK = '<i class="fa fa-check" aria-hidden="true"></i>';
    const WIN = '<div style="font-size: 30px; line-height: 1.75;">WIN</div>';

	var turn = 1; //keeps track of the current turn
    var timeoutID = 0; //stores ID of current timeout to prematurely end timer
    var strict = false; //stores current strict setting
    var playerInput = 0; //keeps track of the number of player inputs
    var sequence = []; //stores main game sequence

    this.start = function() {
        resetColors(); //reset colors to off
        clearTimeout(timeoutID); //prematurely ends any timers
        turn = 1; //resets turns
        sequence = []; //reset sequence array

        //randomly generates a full sequence at start
        for (let i = 0; i < 20; i++) {
            sequence.push(Math.floor(Math.random() * 4));
        }

        flavorAnimation(() => {
            turnDisplay.html("01");
            colorCue(0);
        }, "--")();
    };

    this.changeStrict = () => {
        strict = !strict;
        strictDisplay.css("background-color", strict ? "#13ff7c" : "#00a74a");
    };

    var resetColors = function() {
        green.colorOff();
        red.colorOff();
        yellow.colorOff();
        blue.colorOff();
    };

    var colorCue = function(index) {
        var colorID = 0; // represents number in sequence that represents certain color
        if (index < turn) { //only evaluate sequence array for the turn number we are on
            colorID = sequence[index]; //retrieves color from sequence array
            timeoutID = setTimeout(function() {
                switch(colorID) {
                    case 0:
                        green.colorOn();
                        gsound.play();
                        break;
                    case 1:
                        red.colorOn();
                        rsound.play();
                        break;
                    case 2:
                        yellow.colorOn();
                        ysound.play();
                        break;
                    case 3:
                        blue.colorOn();
                        bsound.play();
                        break;
                    default:
                        console.log("Unrecognized sequence number");
                        break;
                }
                timeoutID = setTimeout(function () {
                    switch(colorID) {
                        case 0:
                            green.colorOff();
                            break;
                        case 1:
                            red.colorOff();
                            break;
                        case 2:
                            yellow.colorOff();
                            break;
                        case 3:
                            blue.colorOff();
                            break;
                        default:
                            console.log("Unrecognized sequence number");
                            break;
                    }
                    colorCue(index + 1); //recursive call to continue sequence display
                }, 1000); // time color stays ON
            }, 500); // time color stays OFF
        } else {
            bindPlayer();
            timeoutID = setTimeout(failInput, 10000);
        }
    };

    var failInput = () => {
        unbindPlayer();
        flavorAnimation(() => {
            if (strict) {
                this.start();
            }
            else {
                turnDisplay.html(turn > 9 ? turn : "0" + turn);
                colorCue(0);
            }
        }, "X")();
    };

    var flavorAnimation = (callback, symbol,  i = 0) => {
        return () => {
            if (i < 4) {
                if (i % 2 === 0) {
                    turnDisplay.html(symbol);
                }
                else {
                    turnDisplay.html("");
                }
                timeoutID = setTimeout(flavorAnimation(callback, symbol, i + 1), 500);
            }
            else {
                callback();
            }
        };
    };

    var checkInput = function(colorID) {
        return function() {
            clearTimeout(timeoutID);
            if (sequence[playerInput] === colorID) {
                playerInput++;
                if (playerInput === turn) {
                    unbindPlayer();
                    if (turn === 20) {
                        flavorAnimation(() => {
                            turnDisplay.html(WIN);
                        }, WIN)();
                    }
                    else {
                        flavorAnimation(() => {
                            turn++;
                            turnDisplay.html(turn > 9 ? turn : "0" + turn);
                            colorCue(0);
                        }, CHECKMARK)();
                    }
                }
                else { //more inputs needed to reach next turn
                    timeoutID = setTimeout(failInput, 10000);
                }
            }
            else {
                failInput();
            }
        }
    };

    var unbindPlayer = function() {
        mainButtons.off().css("cursor", "default");
    };

    var bindPlayer = function() {
        playerInput = 0;
        green.element
            .click(checkInput(0))
            .mousedown(function () {
                gsound.stop();
                green.colorOn();
                gsound.play();
            })
            .on("mouseup mouseleave", function () {
                green.colorOff();
            });
        red.element
            .click(checkInput(1))
            .mousedown(function () {
                rsound.stop();
                red.colorOn();
                rsound.play();
            })
            .on("mouseup mouseleave", function () {
                red.colorOff();
            });
        yellow.element
            .click(checkInput(2))
            .mousedown(function () {
                ysound.stop();
                yellow.colorOn();
                ysound.play();
            })
            .on("mouseup mouseleave", function () {
                yellow.colorOff();
            });
        blue.element
            .click(checkInput(3))
            .mousedown(function () {
                bsound.stop();
                blue.colorOn();
                bsound.play();
            })
            .on("mouseup mouseleave", function () {
                blue.colorOff();
            });
        mainButtons.css("cursor", "pointer");
    };
}




$(function() {
    var game = new Game();
    var startButton = $("#start");
    var strictButton = $("#strict");

    startButton.on("click", function () {
        game.start();
    })
    .mousedown(function () {
        startButton.css("background-color", "#00a74a");
    })
    .on("mouseup mouseleave", function () {
        startButton.css("background-color", "#13ff7c");
    });

    strictButton.on("click", () => {
        game.changeStrict();
    })
    .mousedown(function () {
        strictButton.css("background-color", "#094a8f");
    })
    .on("mouseup mouseleave", function () {
        strictButton.css("background-color", "#1c8cff");
    });

});