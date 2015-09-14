function login() {
username = document.getElementById("username").value;
password = document.getElementById("password").value;
console.log(username);
$.get( "/api/user/login?username=" + username + "&password=" + password +"&");
}

