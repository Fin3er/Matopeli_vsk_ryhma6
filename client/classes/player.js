var loggedInAs ="UnknownPlayer" + Math.floor((Math.random() * 10000) + 1);;

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
document.getElementById("response").innerHTML = "Logged in as <strong>" + username + "</strong>";
loggedInAs = username;
}


});

}