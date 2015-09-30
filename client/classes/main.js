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
	global.establishedGameID = "";

	// * Public static method: moveHere(params) [sets target for a worm, fired by mouse click] *
	// Params: string target (id of gameboard cell div)
	// Return: void

	//NOTE: must be global in order to work with gameboard generation script
	global.moveHere = function(target) {
		global.target = target;
	}


	// * Public static method: establishNewGame() [client establishes a game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.establishNewGame = function() {
		socket.emit("message", { 'request': 'establishNewGame', 'data': ''});
	}


	// * Public static method: gameEstablished() [server has established a new game for client] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.gameEstablished = function(state, data) {
		
		if (global.loggedInAs == data.establisher) {
			// by default, client that established the game, is also joined to the game
			global.myGameID = data.gameID;
		}

		// set state of the game
		setGameState(state, data.gameID);
	}


	// * Public static method: startGame(gameID) [this player starts the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.startGame = function(gameID) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'startGame', 'data': game});
	}


	// * Public static method: endGame(gameID) [this player ends the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.endGame = function(gameID) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'endGame', 'data': game});
	}


	// * Public static method: joinGame(gameID) [this player joins the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.joinGame = function() {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'joinGame', 'data': {'gameID': global.establishedGameID}});
	}


	// * Public static method: joinGame(gameID) [this player leaves the game] *
	// Params: nothing
	// Return: void

	//NOTE: must be global in order to work with the button
	global.leaveGame = function(gameID) {

		// Start a new game object; read current gameboard size from global variables
		socket.emit("message", { 'request': 'leaveGame', 'data': game});
	}


	// * Public static method: setGameState(state) [set states of the game in client] *
	// Params: string state, string gameID, object playerInfo
	// Return: void
	
	global.setGameState = function(state, gameID, playerInfo) {

		// set id of this game
		global.establishedGameID = gameID;

		switch (state) {

			case "established":

				// Control buttons visibility
			    document.getElementById("establishGame").style.display = "none";
			    document.getElementById("removeGame").style.display = "inline-block";
			    document.getElementById("startGame").style.display = "inline-block";
			    document.getElementById("endGame").style.display = "none";

			    if (global.myGameID == global.establishedGameID) {
			    	// player has joined the game
			    	document.getElementById("joinGame").style.display = "none";
			    	document.getElementById("leaveGame").style.display = "inline-block";	
			    }
			    else {
			    	// player hasn't joined the game
			    	document.getElementById("joinGame").style.display = "inline-block";
			    	document.getElementById("leaveGame").style.display = "none";	
			    }
			    break;

			case "empty":
			default:

				// Control buttons visibility
			    document.getElementById("establishGame").style.display = "inline-block";
			    document.getElementById("removeGame").style.display = "none";
			    document.getElementById("startGame").style.display = "none";
			    document.getElementById("endGame").style.display = "none";
			    document.getElementById("joinGame").style.display = "none";
			    document.getElementById("leaveGame").style.display = "none";
			    break;
		}
		
	}


	// --- Other constructor tasks ---

	// Let's have some new dummy gameboard on the screen, before the game has begun and gameboard size is selected
	new GameBoard(global.width, global.height);

	// Make triggers
    document.getElementById("establishGame").addEventListener('click', function() { global.establishNewGame(); });
    document.getElementById("removeGame").addEventListener('click', function() { global.removeGame(); });
    document.getElementById("startGame").addEventListener('click', function() { global.startGame(); });
    document.getElementById("endGame").addEventListener('click', function() { global.endGame(); });
    document.getElementById("joinGame").addEventListener('click', function() { global.joinGame(); });
    document.getElementById("leaveGame").addEventListener('click', function() { global.leaveGame(); });

    // get game state from server, when logging in
    socket.emit("message", { 'request': 'getGameState', 'data' : ""});

}