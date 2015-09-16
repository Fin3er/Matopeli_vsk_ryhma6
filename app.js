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

io.sockets.on('connection', function(socket) {
    socket.on('messageToServer', function(data) {
        io.sockets.emit("messageToClient",{ message: data["message"] });
    });
});
