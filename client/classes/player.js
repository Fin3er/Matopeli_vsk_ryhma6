
// Ensin alustetaan pelaajan käyttäjänimi, default on random numero
var loggedInAs ="UnknownPlayer" + Math.floor((Math.random() * 10000) + 1);;

// Alustetaan chat käyttäjänimellä
function giveName() {
	document.getElementById("id").innerHTML = "Your username is " + loggedInAs;
	loginToOnline(loggedInAs);
}

//rekisteröintimetodi
function register() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	$.get("/api/user/register?username=" + username + "&password=" + password +"&", function(response){
		console.log(response);
		document.getElementById("result").innerHTML = response;
	});
}


// Kirjautuminen. Aluksi katsotaan tietokannasta onko ok. Jos on niin vaihdetaan nimi.f
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
		}
	});
}