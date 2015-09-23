// hommataan tavittavat palikat
var express = require('express'),
app = module.exports.app = express();
var app = express();
var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var bodyParser = require('body-parser');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

/* ===== ExpressJS configs ===== */

app.use(bodyParser.urlencoded({
  extended: true
}));

// set public html directory
app.use(express.static('client'));

//serveri pystyyn
server.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

/*
// välitetään verkkosivutiedosto
app.get('/register', function(req, res){
res.sendFile(__dirname + '/register.html');
	console.log("register.html sent");
});
*/


/* ===== MySQL configs ===== */

//MySQL yhteyden määritys ja muodostus
var connection = mysql.createConnection(require('./dbconfig.js'));

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected to MySQL server!");
});


/* ===== Include all project related server side modules ===== */

fs.readdirSync(__dirname + '/server').forEach(function(filename) {
    if (~filename.indexOf('.js')) {
    	// Note: all modules will need http server and database server objects
        require(__dirname + '/server/' + filename)(app, connection);
    }
});

var userlist = []; // Array käyttäjille

// Reaaliaikaisten toiminnallisuuksien (chat, onlinepelaajat) selkäranka
io.sockets.on('connection', function(socket) {

    socket.on('messageToServer', function(data) { // kun tulee chatviesti, välitetään se kaikille
        io.sockets.emit("messageToClient",{ message: data["message"] });
    });

// kirjautuminen nimellä

socket.on('loginToOnline', function(data) { 
    var isonlist=false;
    userlist.push(data['message'] ); 
    socket.name = data['message'];
    console.log(data['message'] + " added to chat clients");
    io.sockets.emit("clientlist", userlist);
});
// Loginin johdosta tapahtuva nimen vaihto
socket.on('changeName', function(data) { 
    var change = data['message'];
    userlist.splice(userlist.indexOf(socket.name), 1);
    userlist.push(data['message'] ); 
    socket.name = data['message']; 
    io.sockets.emit("clientlist", userlist);
    
});

//poistetaan käyttäjä käyttäjälistasta kun yhteys katkeaa
socket.on('disconnect', function(){ 
    console.log('user' +  socket.name + " disconnected");
    userlist.splice(userlist.indexOf(socket.name), 1);
    console.log("Users still left in chat: ")
    for (var i = 0; i < userlist.length; ++i) {
        console.log(userlist[i]);
    }
    io.sockets.emit("clientlist", userlist);
});


//Receives the rankinglist from database and emits it to ranking.js
socket.on('getHighScoreList',function(){
    connection.query("SELECT user,score FROM highscores ORDER BY score DESC;",function(err,rows,fields) {
        console.log(rows);
        socket.emit("RankingList",JSON.stringify(rows));
    });
});

//Inserts new highscore row to database. After that's done it emits "highScoreAdded" back to ranking.js
socket.on("setHighScoreList",function(name,score){
    //console.log("uusi highscore" + name + score);
    var insert = {user:name,score:score};
    connection.query("INSERT INTO highscores SET ?",insert,function(err,rows){
        if(err){
            console.log("There was an error: " + err);
        }
        else
        console.log("Highscore lisätty");
        socket.emit("highScoreAdded");
    });
});
});