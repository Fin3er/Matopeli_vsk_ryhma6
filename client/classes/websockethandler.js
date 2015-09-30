var socket = io.connect("http://localhost:8080/");

// handle incoming websocket messages

socket.on("message", function(msg) {

	switch (msg.request) {

		case 'publicChatMessage':
			receiveMessage(msg.data);
			break;

		case 'clientList':
			receiveClientList(msg.data);
			break;

		case 'newGameEstablished':
			gameEstablished(msg.data.gameID);
			break;

		case 'setGameState':
			setGameState(msg.data.state);
			break;

		case 'errorMessage':
			console.log("Received an error websocket message from the server: " + JSON.stringify(msg.data));
			break;

		default:
			console.log("Received an unknown websocket message from the server. We're unable to handle it: " + JSON.stringify(msg));
			break;
		}

});
