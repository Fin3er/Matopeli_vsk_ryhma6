/* ==================================================================== */

// ----- Class: Game -----

// Objectives: handles everything related to game sessions

/* ==================================================================== */

// Note: this module isn't initialized while requiring it, but _new_ must be used, when creating players


// * Constructor Game(params, establisherSocket) [makes a new game into the system] *
// Params: string gameID, object establisherSocket
// Returns: void


function Game(gameID, establisherSocket) {

	var gameID = gameID;
	var establisherSocket = {};
	var joinedPlayers = {};

};


Game.prototype.establishGame = function () {


};


Game.prototype.applyToJoinGame = function () {


};


// Make it available outside this file
module.exports = Game;