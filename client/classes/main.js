// * Public references *
var global = this; // global scope can be accessed from anywhere


/* ==================================================================== */

// ----- Class: Main -----

// Objectives: prepares and controls things before and after the game

/* ==================================================================== */


// * Constructor Main() [inits the game app] *
// Params: nothing
// Returns: void

function Main() {


	// * Public static properties *
	// NOTE: must be global in order to work with game board selection widget
	global.width = 20;
	global.height = 20;


	// * Public static method: moveHere(params) [sets target for a worm, fired by mouse click] *
	// Params: string target (id of gameboard cell div)
	// Return: void

	//NOTE: must be global in order to work with gameboard generation script
	global.moveHere = function(target) {
		global.target = target;
	}


	// * Public static method: startGame() [starts the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with game start button
	global.startGame = function() {

		// Start a new game object; read current gameboard size from global variables
		new Game(global.width, global.height);
	}	


	// --- Other constructor tasks ---

	// Let's have some new dummy gameboard on the screen, before the game has begun and gameboard size is selected
	new GameBoard(global.width, global.height);

	// Make startGame trigger
    document.getElementById("play").addEventListener('click', function() { global.startGame(); });

}