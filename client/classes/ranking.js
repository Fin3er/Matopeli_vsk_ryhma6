//Class for managing rankinglist

//TODO Should we add just one highscore/user?
//TODO make this working with server! (do not add here: var socket = io.connect("http://localhost:8080/"); )

//Gets the highscore-data from server and adds the data to index.html as a list
function getHighScoreList(){
	socket.emit("getHighScoreList");

socket.on('RankingList', function(data) {

    var ranking = JSON.parse(data);
    var out ="<ol>";
    var i;
    for (i in ranking){

        out +=  "<li>" + ranking[i].user+ " "+ranking[i].score +"</li>";
    }
        out += "</ol>";
        document.getElementById('ranking').innerHTML = out;
        
    });

}

//Method for sending new highscore-data to server
function setHighScore (name,score) {

	//Checking if the player is logged in, if not, the scores won't be added and message is shown to user
	if(global.isLogged)
	socket.emit("setHighScoreList",name,score);
	else
	window.alert("You have to be logged in to save your score");

//When new highscore-data is added, we update the index.html highscorelist again
socket.on("highScoreAdded",function(){
	getHighScoreList();

}); 
}

