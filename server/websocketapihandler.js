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

		this.chatUserList = []; // array of connected client names (both anonymous and logged-ins)

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
						scope.gs.ws.startGame(socket, msg.data);
						break;

					case 'leaveGame':
						scope.gs.ws.leaveGame(socket, msg.data);
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



	/*	=================================
		WebSocket API server-side messagers
		================================= */

	// Method: broadcast (event, data) - transmit a message to all connected clients
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

		scope.gs.ws.chatUserList.push(data.username); 
	    socket.name = data.username;
	    console.log(data.username + " added to chat clients");

	    // update user list to all connected clients
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.chatUserList);
	}

	// Method: disconnect (socket, data) - removing client when disconnected
	//
	//
	wsH.prototype.disconnectClient = function (socket, data) {

		// TODO: logout user from the game, too! ;) -> can't do this restAPIHandler?

		console.log('user ' +  socket.name + " disconnected");
	    scope.gs.ws.chatUserList.splice(scope.gs.ws.chatUserList.indexOf(socket.name), 1);
	    
	    console.log("Users still left in chat: ");
	    for (var i = 0; i < scope.gs.ws.chatUserList.length; ++i) {
	        console.log(scope.gs.ws.chatUserList[i]);
	    }

	    // update user list to all connected clients
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.chatUserList);
	}

	// Method: changeClientName (socket, data) - connects a registered user
	//
	//
	wsH.prototype.changeClientName = function (socket, data) {
		
		// Replace old user name
	    scope.gs.ws.chatUserList.splice(scope.gs.ws.chatUserList.indexOf(socket.name), 1);
	    scope.gs.ws.chatUserList.push(data.username);
	    socket.name = data.username;

	    // attach web socket to logged in player
	    var player = scope.gs.getPlayer(data.username);

	    if (player != null) {
	    	player.attachWebSocket(socket, function(result, message) {
		    	if (result == "NOK") {
		    		scope.gs.ws.sendErrorMessage(socket, message); // attaching socket failed
		    	};
	    	});
	    }
	    else {
	    	scope.gs.ws.sendErrorMessage(socket, "Unable to attach web socket. Player doesn't found with that name."); // attaching socket failed
	    }	    

	    // update user list to all connected clients
	    scope.gs.ws.broadcastMessage('clientList', scope.gs.ws.chatUserList);
	}


	/*	=================================
		Game-related WebSocket API Handlers
		================================= */

	// Method: establishNewGame (socket) - client establishes a new game to system; game is becomes open for players to join
	//
	//
	wsH.prototype.establishNewGame = function (socket) {

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
		
	}

	// Method: leaveGame (socket, data) - client leaves the game; not possible when game has begun
	//
	//
	wsH.prototype.leaveGame = function (socket, data) {
		
	}


//lue http://socket.io/docs/#
//sub moduulit http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

	// Initialize the module
    var wsh = new wsH();

    /* === Return public variables and methods of this module === */    
    return wsh;

});

// Make it available outside this file
module.exports = WebSocketAPIHandler;