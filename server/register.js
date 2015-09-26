module.exports = function(app, connection) {
	// When server gets data, this is put in to variables. Then the server checks if the username is available and responds accordingly 
	app.get('/api/user/register', function(req, res) {
		var uname = req.query['username'];
		var password = req.query['password'];
		// These are the possible responds that the server sends back to client
		var registermessage = "Thank you, you have registered!";
		var registermessage2 = "Please select another username!";
		var registermessage3 = "Username / password can't be empty!";
		var nicktaken = false;
		console.log("got data!");
		if (password == "" || uname == "") {
			res.send(registermessage3);
			res.end(); }
			else {
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
			}
		})

};