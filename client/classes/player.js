//global variable for player's name that is first based on random number
global.loggedInAs ="UnknownPlayer" + Math.floor((Math.random() * 10000) + 1);;
global.isLogged = false;
global.myGameID = "";

//Starting the chat
function giveName() {
	document.getElementById("id").innerHTML = "Your username is " + loggedInAs;
	loginToOnline(loggedInAs);
}

//Method for registering
function register() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	$.get("/api/user/register?username=" + username + "&password=" + password +"&", function(response){
		console.log(response);
		document.getElementById("result").innerHTML = response.message;
	});
}

// Logging in. Server responds with NOK if username or password was not ok and with OK if they were ok
function login() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	console.log(username);
	$.get("/api/user/login?username=" + username + "&password=" + password +"&", function(response){
		console.log(response);
		if (response.response == "NOK" || response == null) {
			document.getElementById("response").innerHTML = response.message;
		}
		if (response.response == "OK"){
			document.getElementById("id").innerHTML = "Logged in as <strong>" + username + "</strong>";
			document.getElementById("response").innerHTML = "";
			loggedInAs = username;
			changeChatName(username);

			//We change the global isLogged variables value to true
			isLogged=true;

			//Game controls is shown only to authenticated users
			document.getElementById("gamecontrols").style.display = "block";
		}
	});
}

// Update player information to the game interface
function setPlayerInfo(playersInGame) {

	var playerCode = "";
	var playersInGame = playersInGame.data;

	//object structure comes from server class Game: object player, int score, string status
	playersInGame.forEach(function (p) {

		// if user match loggeinas user, he must be joined to the game
		if (p.username == global.loggedInAs) {
			if (global.myGameID != global.establishedGameID) {
				global.myGameID = global.establishedGameID;
				socket.emit("message", { 'request': 'getGameState', 'data' : ""}); // maybe not a good solution, but in this case game state must be updated, so that interface looks correct
			}
		}

		// build UI
		playerCode += '<section class="playerinfo">';
		playerCode += '<div class="playercolor '+p.wormclass+'"></div>'
		playerCode += '<div class="playername">'+p.username+'</div>'
		playerCode += '<div class="playerscore">'+p.score+'</div>'
		playerCode += '<div class="playerstatus">'+p.status+'</div>'
		playerCode += '</section>';
	});

	document.getElementById("players").innerHTML = playerCode;

}