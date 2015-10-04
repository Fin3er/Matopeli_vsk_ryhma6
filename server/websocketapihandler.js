/* ==================================================================== */

// ----- Class: WebSocketAPIHandler -----

// Objectives: handles everything related to websockets api

/* ==================================================================== */

var WebSocketAPIHandler = (function (scope) {

	// * Constructor wsH() [inits the database access] *
	// Params: nothing
	// Returns: void

	function wsH() {

		// storage for private variables
        var priv = { };

        /* === set up web socket with express === */

		this.io = require('socket.io')(scope.server);

		
		/* === Backbone for chat and online players === */

		this.io.sockets.on('connection', function(socket) {

			// Connect a single client
			socket.on('connectClient', function(msg) {
			    scope.gs.ws.connectNewClient(socket, msg.data);
			});


			// Disconnect a single client
			socket.on('disconnect', function(msg) {
			    scope.gs.ws.disconnectClient(socket, msg.data);
			});


			// Handle a received message
			// messages must be in format { request: validrequestname, data: object-or-string}
			socket.on('message', function(msg) {

				console.log("websockethandler received: " + JSON.stringify(msg));

				switch (msg.request) {

					case 'publicChatMessage':
						scope.gs.ws.publicChatMessage(msg.data);
						break;

					case 'changeClientName':
						scope.gs.ws.changeClientName(socket, msg.data);
						break;

					case 'getHighScoreList':
						scope.gs.ws.getHighScoreList(socket);
						break;

					case 'setHighScoreList':
						scope.gs.ws.setHighScoreList(socket, msg.data);
						break;

					case 'establishNewGame':
						scope.gs.ws.establishNewGame(socket);
						break;

					case 'startGame':
						scope.gs.ws.startGame(socket, msg.data);
						break;

					case 'endGame':
						scope.gs.ws.leaveGame(socket, msg.data);
						break;

					case 'joinGame':
						scope.gs.ws.joinGame(socket, msg.data);
						break;

					case 'leaveGame':
						scope.gs.ws.leaveGame(socket, msg.data);
						break;

					case 'getGameState':
						scope.gs.ws.getGameState(socket);
						break;

					case 'errorMessage':
						scope.gs.ws.getErrorMessage(msg.data);
						break;

					default:
						scope.gs.ws.sendErrorMessage(socket, "Unknown event to server. We're unable to handle it.");
						break;
				}

			});

		});

	};


	// Method: getConnectedUsers() - get list of chat users directly from the socket.io
	// param: none
	// return: array
	wsH.prototype.getConnectedUsers = function (data) {

		var clientlist = scope.gs.ws.io.sockets.sockets.map(function(e) {
			return e.name;
		});

		return clientlist.filter(function(e){return e}); // remove empty sockets, in case they exists
	};


	/*	=================================
		WebSocket API server-side messagers
		================================= */

	// Method: broadcastMessage (event, data) - transmit a message to all connected clients
	// 
	// 
	wsH.prototype.broadcastMessage = function (request, data) {
		this.io.sockets.emit('message', { 'request': request, 'data': data});
	};

	// Method: broadcast (event, data) - transmit a message to a single connected client
	// 
	// 
	wsH.prototype.sendMessage = function (socket, request, data) {
		socket.emit('message', { 'request': request, 'data': data});
	};

	// Method: sendErrorMessage (socket, data) - send error message to a single connected socket
	//
	//
	wsH.prototype.sendErrorMessage = function (socket, data) {
		socket.emit('message', { 'request': 'errorMessage', 'data': data});
	};

	// Method: getErrorMessage (data) - receive error message, save it to logs at least
	//
	//
	wsH.prototype.getErrorMessage = function (data) {
		console.log("WebSocketAPIHandler received an error message from client " + socket + ": " + data);
	};

	// Method: broadcastErrorMessage (event, data) - transmit a message to all connected clients
	// 
	// 
	wsH.prototype.broadcastErrorMessage = function (data) {
		this.io.sockets.emit('message', { 'request': 'errorMessage', 'data': data});
	};


	/*	=================================
		Ranking-related WebSocket API Handlers
		================================= */

	// Method: Receives the rankinglist from database and emits it to ranking.js
	//
	//
	wsH.prototype.getHighScoreList = function (socket) {

		// TODO use database handler scope.gs.db.joku-uusi-metodi
/*
		connection.query("SELECT user,score FROM highscores ORDER BY score DESC;", function(err,rows,fields) {
			//console.log(rows);
			scope.gs.ws.sendMessage(socket, 'rankingList', JSON.stringify(rows));
	    });
*/
	};

	// Method: Inserts new highscore row to database. After that's done it emits "highScoreAdded" back to ranking.js
	//
	//
	wsH.prototype.setHighScoreList = function (socket, data) {

		var insert = {user: data.name, score: data.score};

		// TODO use database handler scope.gs.db.joku-uusi-metodi

/*
	    connection.query("INSERT INTO highscores SET ?", insert, function(err,rows) {

	        if (err) {
	            console.log("WebSocketAPIHandler setHighScoreList error: " + err);
	            scope.gs.ws.sendErrorMessage(socket, "WebSocketAPIHandler setHighScoreList error: " + err);
	        }
	        else {
	        console.log("Highscore lisätty");

	        // updata ranking list on all clients
	        scope.gs.ws.broadcastMessage('rankingList', JSON.stringify(rows));
	        }
	    });
*/
	};


	/*	=================================
		Chat-related WebSocket API Handlers
		================================= */

	// Method: publicChatMessage (data) - handle a public chat message
	//
	//
	wsH.prototype.publicChatMessage = function (data) {

		// TODO save this message to database?

		// when a message received, its sent to every client
		scope.gs.ws.broadcastMessage('publicChatMessage', data);
	};


	/*	=================================
		Player-related WebSocket API Handlers
		================================= */

	// Method: connect (socket, data) - connects an anonymous user
	//
	//
	wsH.prototype.connectNewClient = function (socket, data) {

		socket.name = data.username;
	    console.log(data.username + " added to chat clients");

	    // update user list to all connected clients
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.getConnectedUsers());
	    scope.gs.ws.publicChatMessage(socket.name + " joined chat!");
	}

	// Method: disconnect (socket, data) - removing client when disconnected
	//
	//
	wsH.prototype.disconnectClient = function (socket, data) {

		// TODO: logout user from the game, too! ;) -> can't do this restAPIHandler?

	    // update user list to all connected clients
	    scope.gs.ws.publicChatMessage(socket.name + " left chat!");
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.getConnectedUsers());
	}

	// Method: changeClientName (socket, data) - connects a registered user
	//
	//
	wsH.prototype.changeClientName = function (socket, data) {

		// Replace old user name
		scope.gs.ws.publicChatMessage(socket.name + " left chat!");
	    socket.name = data.username;
	    scope.gs.ws.publicChatMessage(socket.name + " joined chat!");

	    // update user list to all connected clients
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.getConnectedUsers());

	    // attach web socket to logged in player
	    var player = scope.gs.getPlayer(socket.name);

	    if (player != null) {
	    	player.attachWebSocket(socket, function(result, message) {
		    	if (result == "NOK") {
		    		scope.gs.ws.sendErrorMessage(socket, message); // attaching socket failed
		    		return;
		    	};
	    	});
	    }
	    else {
	    	scope.gs.ws.sendErrorMessage(socket, "Unable to attach web socket. Player already exists or doesn't found with that name."); // attaching socket failed
	    	return;
	    }
	}


	/*	=================================
		Game-related WebSocket API Handlers
		================================= */

	// Method: establishNewGame (socket) - client establishes a new game to system; game is becomes open for players to join
	//
	//
	wsH.prototype.establishNewGame = function (socket) {

		scope.gs.establishNewGame(socket, function(result, data) {

			switch (result) {

				case "OK":
					// announce this to all clients
	    			scope.gs.ws.broadcastMessage('newGameEstablished', {'establisher': socket.name, 'gameID': data.gameID});
	    			scope.gs.ws.publicChatMessage('<strong>Game Server:</strong> A new game established by user ' + socket.name + ". Would you like to join?");
	    			// update also player interface
	    			scope.gs.ws.setPlayerInfo(data.gameID);
					break;

				case "NOK":
				default:
					// it failed, tell to establisher only
					scope.gs.ws.sendErrorMessage(socket, data.error);
					break;
			}

		});
	}

	// Method: startGame (socket, data) - client starts a new game; possible when there's at least 1 player
	//
	//
	wsH.prototype.startGame = function (socket, data) {
		
	}

	// Method: endGame (socket, data) - client ends the game; ends established or started game
	//
	//
	wsH.prototype.endGame = function (socket, data) {
		
	}

	// Method: joinGame (socket, data) - client joins the game; not possible when game has begun
	//
	//
	wsH.prototype.joinGame = function (socket, data) {

		var game = scope.gs.getGame(data.gameID);
		var player = scope.gs.getPlayer(socket.name);

		if (game == null || player == null) {
			scope.gs.ws.sendErrorMessage(socket, 'Unknown gameID '+data.gameID+' or playerName '+socket.name);
		}
		else {
			game.joinGame(player, function(result, data) {
				if (result == "OK") {
					scope.gs.ws.broadcastMessage('setPlayerInfo', {'data': data});
				}
				else {
					scope.gs.ws.sendErrorMessage(socket, data.error);
				}
			});
		}
	}

	// Method: leaveGame (socket, data) - client leaves the game; not possible when game has begun
	//
	//
	wsH.prototype.leaveGame = function (socket, data) {
		
	}

	// Method: getGameState (socket) - client asks the game state, so let's tell it
	//
	//
	wsH.prototype.getGameState = function (socket) {

		scope.gs.getGameState(function(state, gameID) {
			if (state == "error") {
				scope.gs.ws.sendErrorMessage(socket, 'Unknown game state. Server is out of order.');
				scope.gs.ws.sendMessage(socket, 'setGameState', {'state': 'empty', 'gameID': ''});
			}
			else {
				scope.gs.ws.sendMessage(socket, 'setGameState', {'state': state, 'gameID': gameID});
				scope.gs.ws.setPlayerInfo(gameID);
			}
		});
	}

	// Method: setPlayerInfo (socket, gameID) - provides player info of the game; this is mainly called from client with "getGameState" or "establishNewGame"
	//
	//
	wsH.prototype.setPlayerInfo = function (gameID) {
		var game = scope.gs.getGame(gameID);
		if (game != null) {
			scope.gs.ws.broadcastMessage('setPlayerInfo', {'data': game.getPlayerInfo()});
		}
		// if it was null, we don't care this time
	}

	// Initialize the module
    var wsh = new wsH();

    /* === Return public variables and methods of this module === */    
    return wsh;

});

// Make it available outside this file
module.exports = WebSocketAPIHandler;