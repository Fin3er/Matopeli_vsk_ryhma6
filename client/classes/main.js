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

/*

	// * Public static method: startGame() [starts the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with game start button
	global.startGame = function() {

		// Start a new game object; read current gameboard size from global variables
		new Game(global.width, global.height);
	}	
*/

	// * Public static method: establishNewGame() [establish a game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.establishNewGame = function() {
		socket.emit("message", { 'request': 'establishNewGame', 'data': ''});
	}


	// * Public static method: startGame(game) [this player starts the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.startGame = function(game) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'startGame', 'data': game});
	}


	// * Public static method: endGame(game) [this player ends the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.endGame = function(game) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'endGame', 'data': game});
	}


	// * Public static method: joinGame(game) [this player joins the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.joinGame = function(game) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'joinGame', 'data': game});
	}


	// * Public static method: joinGame(game) [this player leaves the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.leaveGame = function(game) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'leaveGame', 'data': game});
	}
	


	// --- Other constructor tasks ---

	// Let's have some new dummy gameboard on the screen, before the game has begun and gameboard size is selected
	new GameBoard(global.width, global.height);

	// Make triggers
    document.getElementById("establishGame").addEventListener('click', function() { global.establishNewGame(); });
    document.getElementById("startGame").addEventListener('click', function() { global.startNewGame(); });
    document.getElementById("endGame").addEventListener('click', function() { global.endNewGame(); });
    document.getElementById("joinGame").addEventListener('click', function() { global.joinNewGame(); });
    document.getElementById("leaveGame").addEventListener('click', function() { global.leaveNewGame(); });

}