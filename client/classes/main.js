// global scope can be accessed from anywhere
var global = this;


/* ==================================================================== */

// ----- Class: Main -----
// Contains: prepares and controls things before and after the game

/* ==================================================================== */

// Constructor - inits the game app
// Params: nothing
// Returns: nothing

function Main() {

	// set some initial vars
	// NOTE: must be global in order to work with game board selection widget
	global.width = 20;
	global.height = 20;


	// --- Methods inside constructor ---

	// Method: moveHere - sets target for a worm
	// Params: target (id of div)
	// Return: nothing

	//NOTE: must be global in order to work with gameboard generation script
	global.moveHere = function(target) {
		global.target = target;
	}


	// Method: startGame - starts the game
	// Params: nothing
	// Return: nothing

	// NOTE: must be inside constructor and before startGame trigger in order to work
	global.startGame = function() {

		// start a new game object; read gameboard size from global variables
		new Game(global.width, global.height);
	}	


	// --- Other constructor tasks ---

	// let's have some dummy gameboard on the screen, before the game has begun and gameboard size is selected
	new GameBoard(global.width, global.height);

	// Make startGame trigger
    document.getElementById("play").addEventListener('click', function() { global.startGame(); });

}