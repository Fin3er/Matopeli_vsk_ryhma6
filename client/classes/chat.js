var socketio = io.connect("http://localhost:8080/");
var clientlist = [];

//viestin lähettämisen koodi
function sendMessage(){ 
	var data = document.getElementById("message_input").value;
	document.getElementById("message_input").value = '';
	console.log(data);
	socketio.emit("messageToServer", { message : "<strong>" + loggedInAs + "</strong>" + ": " + data});
};

//viestin vastaanottamisen koodi
socketio.on("messageToClient", function(data) {
	var time = new Date();
	document.getElementById("chatmessages").innerHTML = ("<hr/>" + addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + " " + data['message'] + document.getElementById("chatmessages").innerHTML);
});

//koodi online-pelaakine päivittämiseen
socketio.on("clientlist", function(data) {
	clientlist = data;
	document.getElementById("onlinelist").innerHTML = ("");

	for (var i = 0; i < clientlist.length; ++i) {
		console.log(clientlist[i]);
		document.getElementById("onlinelist").innerHTML = ("<br>" + clientlist[i] + document.getElementById("onlinelist").innerHTML);
	}
});

 //toisten moduulien käyttämät koodit (nimen vaihto ja kirjautuminen nimellä onlinepelaajiin / chattiin)
 function loginToOnline(data) {
 	socketio.emit("loginToOnline", { message : data});
 };

 function changeChatName(data) {
 	socketio.emit("changeName", { message : data});
 };

//Funktio kelloon
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
