/* ==================================================================== */

// ----- Class: Game -----

// Objectives: handles everything related to game sessions

/* ==================================================================== */

// Note: this module isn't initialized while requiring it, but _new_ must be used, when creating players


// * Constructor Game(params, playerThatEstablishedTheGame) [makes a new game into the system] *
// Params: string gameID, object eplayerThatEstablishedTheGame
// Returns: void


function Game(gameID, playerThatEstablishedTheGame) {

	// storage for private variables
    var priv = { };

	priv.gameID = gameID; // unique id of the game
	priv.establisher = playerThatEstablishedTheGame; // this is only player object
	priv.joinedPlayers = [{'player': playerThatEstablishedTheGame, 'score': '0', 'status': 'alive', 'worm': 'worm_1'}]; // this includes player, score and status [alive/dead]
	priv.state = "established";  // state can be [established/running/over]


	// * Privileged public method getState() *
	// params: none
	// return: string state of the game
	this.getState = function() {
		return priv.state;
	}


	// * Privileged public method getID() *
	// params: none
	// return: string gameID
	this.getID = function() {
		return priv.gameID;
	}


	// * Privileged public method getJoinedPlayers() *
	// params: none
	// return: array of objects joinedPlayers
	this.getJoinedPlayers = function() {
		return priv.joinedPlayers;
	}


	// * Privileged public method getPlayerInfo() *
	// params: none
	// return: array of players info in this game
	// NOTE: we need this conversion because methods can't be send to clients with JSON
	this.getPlayerInfo = function() {

		var playerInfo = [];

		priv.joinedPlayers.forEach(function (p) {
			//TODO fix wormclass getter
			playerInfo.push({'username': p.player.getUsername(), 'score': p.score, 'status': p.status, 'wormclass': p.worm+'_cell'});
		});

		return playerInfo;
	}


	// * Privileged public method joinGame(player, callback) *
	// params: object player
	// return: OK/NOK
	this.joinGame = function(player, callback) {

		// in this game version, there can be max X players
		if (priv.joinedPlayers.length >= scope.gs.getMaxPlayers()) {
			callback("NOK", "There is already " + priv.joinedPlayers.length + " of " + scope.gs.getMaxPlayers() + " players in the game. You can't join this time. Sorry.")
        	return;
		}

		// check if player has already joined the game
		var result = priv.joinedPlayers.filter(function(joinedPlayer) {
          return joinedPlayer.player == player;
        });

        if (result.length > 0) {
        	callback("NOK", "This player has already joined this game.")
        	return;
        }

        // add player object to joined players array and call back home
        priv.joinedPlayers.push({'player': player, 'score': '0', 'status': 'alive', 'worm': 'worm_1'});
        callback("OK", this.getPlayerInfo());
	}

};

// Make it available outside this file
module.exports = Game;