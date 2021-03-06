let afterReset = false; //Flag used to manage the unmatch class after reseting the game.
let clickCounter = 0;
let moveCounter = 0;
let totalStars = 3; //Starting with 3 stars.

/**
 * Shuffle function from http://stackoverflow.com/a/2450976.
 * @param {*} array The array to be shuffled
 * @returns The shuffled array.
 */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*** Resets the deck of cards that are not matched.*/
function resetCards() {
    $('.deck li').each(function() {
        let resetFlag = $(this).hasClass('open');
        let isUnmatched = $(this).hasClass('unmatch');
        if (resetFlag) {
            $(this).toggleClass('open');
            $(this).toggleClass('close');
            $(this).toggleClass('show');
        }
        if (isUnmatched) {
            $(this).toggleClass('unmatch');
        }
    });
    //Reset click counter.
    clickCounter = 0;
}

/** Prints move number on the score pannel.*/
function increaseMoves() {
    moveCounter++;
    $('.moves').empty();
    $('.moves').append(moveCounter);
}

/*** What Prints on the PopUp board when the final score is in. */
function printScore() {
    //Print move number on the results PopUp.
    $('.stats').empty();
    $('.stats').append("You made " + moveCounter + " moves.<br>");
    //Print out the stars-score on the result PopUp.
    if (totalStars == 3) {
        $('.stats').append("<br>YO! you got " + totalStars + " stars! YOU'RE AWESOME!!");
        $('.stats').append("<br><span class='stars'>★★★</span>");
    } else if (totalStars == 2) {
        $('.stats').append("<br>You got " + totalStars + " stars. You did great! Almost there...");
        $('.stats').append("<br><span class='stars'>★★☆</span>");
    } else if (totalStars == 1) {
        $('.stats').append("<br>HEY buddy you got " + totalStars + " star. I think you can do better.");
        $('.stats').append("<br><span class='stars'>★☆☆</span>");
    }
    //Prints the time.
    let seconds = $('#seconds').text();
    let tens = $('#tens').text();
    $('.stats').append("<br><br>Your time is " + seconds + "s and " + tens + "ms.");
}

$(function() {

    /**Restarts the game.*/
    function playAgain() {
        //Turns the cards around.
        resetCards(); //Resets the unmatched cards.
        afterReset = true;
        $('.deck li').each(function() {
            let isMatched = $(this).hasClass('match');
            if (isMatched) {
                $(this).toggleClass('match');
                $(this).toggleClass('close');
                $(this).toggleClass('show');
            }
        });

        //Shuffles the cards again,
        let shuffledCards = shuffle(cardsToShuffle);
        $('.deck').append(shuffledCards);

        //Resets click counter.
        clickCounter = 0;
        //Resets move counter.
        moveCounter = 0;
        $('.moves').empty();
        $('.moves').append(moveCounter);
        //Resets the star ratings.
        totalStars = 3;
        $('#star1').find('strong').html('★');
        $('#star2').find('strong').html('★');
        $('#star3').find('strong').html('★');
        //Resets the timer.
        clearInterval(Interval);
        tens = "00";
        seconds = "00";
        appendTens.innerHTML = tens;
        appendSeconds.innerHTML = seconds;
    }

    /** In case the two cards have matched this function enables the appropriate classes. */
    function matchCards() {
        $(flippedCards.card1element).toggleClass('open');
        $(flippedCards.card1element).toggleClass('match');
        $(flippedCards.card2element).toggleClass('open');
        $(flippedCards.card2element).toggleClass('match');
        clickCounter = 0;
    }

    /** In case the two cards do not match, takes the appropriate actions.*/
    function unmatchCards() {
        $(flippedCards.card1element).toggleClass('unmatch');
        $(flippedCards.card2element).toggleClass('unmatch');
        //Resets the cards that did not match.
        setTimeout(resetCards, 500);
    }

    /** This Function Subtracts a star from the rating every 10 moves.*/
    function handleStars() {
        if (moveCounter == 10) {
            $('#star3').find('strong').html('☆');
            totalStars--;
        }
        if (moveCounter == 20) {
            $('#star2').find('strong').html('☆');
            totalStars--;
        }
    }

    /** Starts the timer. (Timer inspiration from https://codepen.io/cathydutton/pen/GBcvo.) */
    function startTimer() {
        tens++;

        if (tens < 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (tens > 99) {
            console.log("seconds");
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

    }

    //Gets the cards in order to shuffle them.
    let cards = document.getElementsByClassName("card");
    let cardsToShuffle = [...cards];
    let shuffledCards = shuffle(cardsToShuffle);

    //Used to check if cards match.
    let flippedCards = {
        card1class: "",
        card1element: "",
        card2class: "",
        card2element: ""
    };

    //Checks if game has been completed
    let matchFlag = false;

    //Timer variables
    var seconds = 0;
    var tens = 0;
    var appendTens = document.getElementById("tens");
    var appendSeconds = document.getElementById("seconds");
    var Interval;

    //Set shuffled cards on deck.
    $('.deck').empty();
    $('.deck').append(shuffledCards);

    //Restart the game after pressing the restart button.
    $('.restart').click(function() {
        playAgain();
    });

    //Flip and match cards.
    $('.deck').on('click', 'li', function() {
        let isClosed = $(this).hasClass('close');
        let isShown = $(this).hasClass('show');

        //Start timer.
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);

        if (clickCounter <= 2) { //Makes sure the user doesn't open a third card.
            let isMatched = $(this).hasClass('match');

            if (isClosed) {
                clickCounter += 1;

                if (clickCounter <= 2) {
                    $(this).toggleClass('open');
                    $(this).toggleClass('close');
                    $(this).toggleClass('show');

                    if (clickCounter == 1) {
                        flippedCards.card1class = $(this).children('i').attr('class');
                        flippedCards.card1element = $(this);
                    }
                    if (clickCounter == 2) {
                        increaseMoves();

                        flippedCards.card2class = $(this).children('i').attr('class');
                        flippedCards.card2element = $(this);

                        //In case the cards match.
                        if (flippedCards.card1class == flippedCards.card2class) {
                            matchCards();
                        } else {
                            if (afterReset == false) {
                                unmatchCards();
                            }
                        }
                        handleStars();
                    }
                }
            }
        }
        afterReset = false;
        //After each click check if deck is complete.
        let matchCounter = 0;
        $('.deck li').each(function() {
            let isMatched = $(this).hasClass('match');
            if (isMatched) {
                matchCounter++;
                if (matchCounter == cards.length) { //If all 16 cards have matched, raise flag.
                    matchFlag = true; //Game has been completed
                }
            }
        });

        //If the game has been completed, show PopUp.
        if (matchFlag) {
            clearInterval(Interval); //Stop timer.
            printScore();

            //Open the results module.
            let targeted_popup_class = $('[data-popup-open]').attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
            matchFlag = false;
        }
    });

    $('.playAgain').click(function() {
        playAgain();
    });

    //PopUp inspiration from http://inspirationalpixels.com/tutorials/custom-popup-modal#step-html.

    /* //Open link (used for debbuging the modal).
    $('[data-popup-open]').on('click', function (e) {
        var targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        e.preventDefault();
    }); */

    //Close
    $('[data-popup-close]').on('click', function(e) {
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        matchFlag = false;
        e.preventDefault();
    });

});