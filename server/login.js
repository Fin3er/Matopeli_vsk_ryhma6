module.exports = function(app, connection) {
// Kirjautuessa tänne välittyvät käyttäjän syöttämä salasana sekä käyttäjätunnus.
// Serveri tarkastaa löytyykö tietokannasta vastaavia rivejä ja palauttaa vastauksen.
// Mikäli salasana ja käyttäjätunnus on ok, palvelin lähettää kokonaisluvun 1. Muussa tapauksessa 0.
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


