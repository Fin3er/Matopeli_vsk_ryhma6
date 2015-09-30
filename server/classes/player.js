/* ==================================================================== */

// ----- Class: Player -----

// Objectives: handles everything related to _authenticated_ players

/* ==================================================================== */

// Note: this module isn't initialized while requiring it, but _new_ must be used, when creating players


// * Constructor Player(username) *
// Params: string username
// Returns: void

function Player(username) {

	// storage for private variables
    var priv = { };

	priv.username = username; // username should match with socket.name
	priv.socket = {}; // websocket that binds to this player

	this.getUsername = function () {
		return priv.username;
	}

	// privileged public method attachWebSocket (socket, callback)
	this.attachWebSocket = function (socket, callback) {

		if (Object.keys(priv.socket).length > 0) {
			//socket is already attached.. what's going on here?
			callback("NOK", "Socket is already attached to this player.");
			return;
		}

		if (socket.name == priv.username) {
			//name match, so let's attach the socket
			priv.socket = socket;
			console.log("player "+priv.username+" logged in to the system and websocket became successfully attached");
		}
		else {
			//TODO delete this player object from the system
			callback("NOK", "Socket.name didn't match registered player name.");
			scope.gs.dropPlayer(this);
		}
	};

};


Player.prototype.establishGame = function () {


};


Player.prototype.applyToJoinGame = function () {


};


// Make it available outside this file
module.exports = Player;