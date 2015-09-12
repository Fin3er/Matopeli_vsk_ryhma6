// hommataan tavittavat palikat
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser());
var mysql = require('mysql');

// tässä määritellään serverin palautukset, kun yritetty rekisteröityä
var registermessage = "Thank you, you have registered!";
var registermessage2 = "Please select another username!";

//serveri pystyyn
app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

//MySQL yhteyden määritys ja muodostus
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'karhu',
  database : 'matopeli',
});

connection.connect(function(err) {
console.log("Connected to MySQL server!")
});

// välitetään verkkosivutiedosto
app.get('/register', function(req, res){
res.sendFile(__dirname + '/register.html');
	console.log("register.html sent");
});

//kun severille tulee tietoa, napataan nämä muuttujiin. Sitten tsekataan onko tietokannassa jo vastaavaa käyttäjänimeä käytössä. Jos on niin pyydetään valitsemaan toinen käyttäjänimi. Jos ei niin rekisteröinti ok.
app.post('/senddata', function(req, res) {
	var nicktaken = false;
	console.log("got data!");
	var uname = req.body.username;
	var password = req.body.password;
	var queryString = "SELECT username FROM users WHERE username='" + uname + "'";
	console.log(queryString);
	connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Username taken: ', rows[i].username);
        nicktaken = true;
    }
    if (nicktaken){
	res.send(registermessage2);
	res.end();

	}

	else{	
	res.send(registermessage);
	var user = { username: uname, password: password };
	connection.query('INSERT INTO users SET ?', user, function(err,res){
});
}
});
});

