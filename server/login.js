module.exports = function(app, connection) {
// When loggin in the the server checks the database - if it has a matching row.
// If username and password are ok, server sends the client a number 1 and if not, server sends the client a number 0.
	app.get('/api/user/login', function(req, res) {
		var uname = req.query['username'];
		var pass = req.query['password'];
		console.log("logging in user " + uname);
		var queryString = "SELECT * FROM users WHERE username='" + uname + "'";
		console.log(queryString);
		connection.query(queryString, function(err, rows, fields) {
			if (err) throw err;
			for (var i in rows) {
				if (pass == rows[i].password) {
					console.log("password is ok!")
					res.send("1");
				}
				else {
					console.log("password is not ok!")
					res.send("0");
				}
			}
			res.end();
		});
	});
}


