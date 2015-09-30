var clientlist = [];

//Sending a message
function sendMessage(){ 
	var data = document.getElementById("message_input").value;
	document.getElementById("message_input").value = '';
	socket.emit("message", { 'request': 'publicChatMessage', 'data' : "<strong>" + loggedInAs + "</strong>" + ": " + data});
};

//Receiving a message
function receiveMessage(data){
	var time = new Date();
	document.getElementById("chatmessages").innerHTML = ("<hr/>" + addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + " " + data + document.getElementById("chatmessages").innerHTML);	
};

//Sending a system message
function sendSystemMessage(data){ 
	socket.emit("message", { 'request': 'publicChatMessage', 'data' : '<strong>Game Client of ' + loggedInAs + ':</strong> ' + data});
};

//This updates the online players -list on page
function receiveClientList(data){
	clientlist = data;
	document.getElementById("onlinelist").innerHTML = ("");

	for (var i = 0; i < clientlist.length; ++i) {
		document.getElementById("onlinelist").innerHTML = ("<br>" + clientlist[i] + document.getElementById("onlinelist").innerHTML);
	}
};

//Functions that other modules use
function loginToOnline(data) {
 	socket.emit("connectClient", { 'data': {'username': data}});
};

function changeChatName(data) {
 	socket.emit("message", { 'request': 'changeClientName', 'data': {'username': data}});
};

//Funktio kelloon
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
