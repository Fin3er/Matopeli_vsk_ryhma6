//global variable for player's name that is first based on random number
global.loggedInAs ="UnknownPlayer" + Math.floor((Math.random() * 10000) + 1);;
global.isLogged = false;


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
		document.getElementById("result").innerHTML = response;
	});
}


// Loggin in. Server responds with number 0 if username or password was not ok and with number 1 if they were ok
function login() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	console.log(username);
	$.get("/api/user/login?username=" + username + "&password=" + password +"&", function(response){
		console.log(response);
		if (response == 0 || response == null) {
			document.getElementById("response").innerHTML = "Username or password was wrong";
		}
		if (response == 1){
			document.getElementById("id").innerHTML = "Logged in as <strong>" + username + "</strong>";
			document.getElementById("response").innerHTML = "";
			loggedInAs = username;
			changeChatName(username);
			//We change the global isLogged variables value to true
			isLogged=true;
		}
	});
}