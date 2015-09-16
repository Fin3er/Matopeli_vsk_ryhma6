var socketio = io.connect("http://localhost:8080/");


function sendMessage(){
var data = document.getElementById("message_input").value;
document.getElementById("message_input").value = '';
console.log(data);
var time = new Date();
socketio.emit("messageToServer", { message : time.getHours() + ":" + time.getMinutes() + " " + "<strong>" + loggedInAs + "</strong>" + ": " + data});
}

socketio.on("messageToClient", function(data) {
document.getElementById("chatmessages").innerHTML = ("<hr/>" + data['message'] + document.getElementById("chatmessages").innerHTML);
});


