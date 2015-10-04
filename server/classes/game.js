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

    priv.playerDefaults = function (player) {
    	return {'player': player, 'score': '0', 'status': 'alive', 'wormID': 'worm_x', 'worm': {}}
    };

	priv.gameID = gameID; // unique id of the game
	priv.establisher = playerThatEstablishedTheGame; // player (object) that established the game session
	priv.joinedPlayers = [priv.playerDefaults(playerThatEstablishedTheGame)];
	priv.gameState = "established";  // game state can be [established/running/over]

	priv.interval = {}; // placeholder of interval object for reference
	priv.gameSpeed = 400;

	// gameboard size
	priv.width = 20;
	priv.height = 20;

	// worm defaults
	priv.wormLength = 5;

	priv.wormDefaults = [ // in this game version, limit is 4 players per game
		{'wormID': 'worm_1', 'startPos': parseInt(priv.width/5*1)+'_0', 'target': parseInt(priv.width/5*1)+'_'+priv.height},
		{'wormID': 'worm_2', 'startPos': parseInt(priv.width/5*2)+'_0', 'target': parseInt(priv.width/5*2)+'_'+priv.height},
		{'wormID': 'worm_3', 'startPos': parseInt(priv.width/5*3)+'_0', 'target': parseInt(priv.width/5*3)+'_'+priv.height},
		{'wormID': 'worm_4', 'startPos': parseInt(priv.width/5*4)+'_0', 'target': parseInt(priv.width/5*4)+'_'+priv.height},
	];
	
	// load gameboard class; it's auto-initializing
	priv.gameboard = require('./gameboard.js')(priv.width, priv.height);

	// load worm class; worms needs to init with new
    priv.worm = require('./worm.js');


		// * Privileged public method getGameSpeed() *
	// params: none
	// return: int speed
	this.getGameSpeed = function() {
		return priv.gameSpeed;
	};

	// * Privileged public method getGameState() *
	// params: none
	// return: string state of the game
	this.getGameState = function() {
		return priv.gameState;
	};


	// * Privileged public method getID() *
	// params: none
	// return: string gameID
	this.getID = function() {
		return priv.gameID;
	};


	// * Privileged public method getJoinedPlayers() *
	// params: none
	// return: array of objects joinedPlayers
	this.getJoinedPlayers = function() {
		return priv.joinedPlayers;
	};


	// * Privileged public method getScore() *
	// params: none
	// return: int score
	this.getScore = function() {
		//return score;
		//TODO
	};

	// * Privileged public method addScore() *
	// params: none
	// return: void
	this.addScore = function() {
		//score++;
		//TODO
	};


	// * Privileged public method getPlayerInfo() *
	// params: none
	// return: array of players info in this game
	// NOTE: we need this conversion because methods can't be send to clients with JSON
	this.getPlayerInfo = function() {

		var playerInfo = [];

		priv.joinedPlayers.forEach(function (p) {
			//TODO fix wormclass getter
			playerInfo.push({'username': p.player.getUsername(), 'score': p.score, 'status': p.status, 'wormclass': p.wormID+'_cell'});
		});

		return playerInfo;
	};


	// * Privileged public method joinGame(player, callback) *
	// params: object player, object callback
	// return: OK/NOK
	this.joinGame = function(player, callback) {

		// in this game version, there can be max X players
		if (priv.joinedPlayers.length >= scope.gs.getMaxPlayers()) {
			callback("NOK", {'error': "There is already " + priv.joinedPlayers.length + " of " + scope.gs.getMaxPlayers() + " players in the game. You can't join this time. Sorry."});
        	return;
		}

		// check if player has already joined the game
		var result = priv.joinedPlayers.filter(function(joinedPlayer) {
          return joinedPlayer.player == player;
        });

        if (result.length > 0) {
        	callback("NOK", {'error': "This player has already joined this game."});
        	return;
        }

        // add player object to joined players array and call back home
        priv.joinedPlayers.push(priv.playerDefaults(player));
        callback("OK", this.getPlayerInfo());
	};


	// * Privileged public method startGame(callback) *
	// params: object callback
	// return: OK/NOK
	this.startGame = function(callback) {

		// create worms for all players
		for (var i=0; i<priv.joinedPlayers.length; i++) {

			// create a new worm
			var def = priv.wormDefaults[i];
			var worm = new priv.worm(def.wormID, def.startPos, def.target, priv.wormLength);

			// attach a worm to a player in this game
			priv.joinedPlayers[i].wormID = def.wormID;
			priv.joinedPlayers[i].worm = worm;

			// draw worm to the game board
			priv.gameboard.drawToBoard(worm.getPositions());
		}

		// start making hearbeats
		priv.interval = setInterval(function () {
			priv.gameLoop();}, priv.speed);

		// launch the game
		priv.gameState = 'running';
		callback("OK", "");
	}


	// * Private method gameLoop() *
	// params: 
	// return: 
	priv.gameLoop = function() {
		//console.log("heartbeat");
	}


	// * Public properties *

/*	TODO
	
	this.gameBoard = new GameBoard(width, height); // Let's have a new gameboard for this game session	
	this.worm = new Worm('worm_1', width/2, height/2, 5, 400); // This time just one new worm to the game Params: scope, wormId, startPosX, startPosY, length, speed
	this.gameBoard.setScore(score); // This is set so score will display zero after 2nd push of "play" - button.

	// --- Other constructor tasks ---

	//Check if there is existing food on the gameboard
	if (this.gameBoard.hasFood == false) {
		
		this.gameBoard.addFood('basicfood'); //Adds some new food, initially
	};

*/

};

/*

// * Public method: evalWormMove(params) [what happens to worm, when it takes this step]
// Params: int posX, int posY, string wormId [id of worm]
// Return: object.wormDestiny [this will happen to the worm]

Game.prototype.evalWormMove = function(posX, posY, wormId) {


	result = scope.gameBoard.getPositionInfo(posX, posY);

// TODO: do something with results - create game logic here: game over? some collision? more score?

	//when worm hits apple
	if(this.gameBoard.foodPosX == posX && this.gameBoard.foodPosY  == posY){
		//add one scorepoint
		this.addScore();
		//just for testing
		console.log("Piste: "+ this.getScore());
	
		//draw new food
		this.gameBoard.addFood('basicfood');
		//Get new score
		this.gameBoard.setScore(this.getScore()); 
		//return state of worm
		return {'wormDestiny': 'eat'};
	}
	//Checking if the worm is going against the walls
	else if (posX > (this.gameBoard.width-1) || posX < 0 || posY > (this.gameBoard.height-1) || posY < 0)
	{
		console.log("Seinä");
		//Assigning the worm to null, but there are still things to do. We haven't completed the gameover yet.
		this.worm=null;
		window.alert("Game Over");
		setHighScore(global.loggedInAs,this.getScore());
		return {'wormDestiny': 'die'};
	}
		else
			{
				return {'wormDestiny': 'go-on'};
			}
	
}
*/

// Make it available outside this file
module.exports = Game;