function login() {
username = document.getElementById("username").value;
password = document.getElementById("password").value;
console.log(username);

$.get("/api/user/login?username=" + username + "&password=" + password +"&", function(response){
console.log(response);

if (response == 0 || response == null) {
document.getElementById("response").innerHTML = "Username or password was wrong";
}

if (response == 1){
document.getElementById("response").innerHTML = "Logged in as <strong>" + username + "</strong>";
}


});

}

function sendMessage(){
	
}