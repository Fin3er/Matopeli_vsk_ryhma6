var socket = io.connect("http://localhost:8080/");

// handle incoming websocket messages

socket.on("message", function(msg) {

	console.log("received from server: " + JSON.stringify(msg));

	switch (msg.request) {

		case 'publicChatMessage':
			receiveMessage(msg.data);
			break;

		case 'clientList':
			receiveClientList(msg.data);
			break;

		case 'newGameEstablished':
			gameEstablished('established', msg.data);
			break;

		case 'setGameState':
			setGameState(msg.data.state, msg.data.gameID);
			break;

		case 'setPlayerInfo':
			setPlayerInfo(msg.data);
			break;

		case 'drawToBoard':
			global.gameboard.drawToBoard(msg.data);
			break;

		case 'errorMessage':
			console.log("Received an error websocket message from the server: " + JSON.stringify(msg.data));
			break;

		default:
			console.log("Received an unknown websocket message from the server. We're unable to handle it: " + JSON.stringify(msg));
			break;
		}

});
