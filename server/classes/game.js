/* ==================================================================== */

// ----- Class: Game -----

// Objectives: handles everything related to game sessions

/* ==================================================================== */

// Note: this module isn't initialized while requiring it, but _new_ must be used, when creating players


// * Constructor Game(params, establisherSocket) [makes a new game into the system] *
// Params: string gameID, object establisherSocket
// Returns: void


function Game(gameID, establisherSocket) {

	// storage for private variables
    var priv = { };

	priv.gameID = gameID;
	priv.establisherSocket = {};
	priv.joinedPlayers = {};
	priv.state = "established";

	// * Privileged public method getState() *
	// params: none
	// return: string state of the game
	this.getState = function() {
		return priv.state;
	}

};


Game.prototype.establishGame = function () {


};


Game.prototype.applyToJoinGame = function () {


};


// Make it available outside this file
module.exports = Game;