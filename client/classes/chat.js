var socketio = io.connect("http://localhost:8080/");

function sendMessage(){
var data = document.getElementById("message_input").value;
document.getElementById("message_input").value = '';
console.log(data);
socketio.emit("messageToServer", { message : data});
}

socketio.on("messageToClient", function(data) {
document.getElementById("chatmessages").innerHTML = ("<hr/>" + data['message'] + document.getElementById("chatmessages").innerHTML);
});