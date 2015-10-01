/* ==================================================================== */

// ----- Module: DbHandler -----

// Objectives: handles everything related to databases

/* ==================================================================== */

var DbHandler = (function (scope) {

	// * Constructor dbH() [inits the database access] *
	// Params: nothing
	// Returns: void

	function DbH() {

		// storage for private variables
        var priv = { };

        /* === set up mysql server === */

        priv.mysql = require('mysql');

        this.connection = priv.mysql.createConnection(require('../dbconfig.js'));

        this.connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected to MySQL server!");
        }); 
	};

var crypto = require('crypto'), // encryption cipher details
    algorithm = 'aes-256-ctr',
    passphrase = 'ffg66dfsd4f';

	DbH.prototype.checkUserPassword = function (uname, pass, res, callback) {

		// TODO: sql injection problems?

		var queryString = "SELECT * FROM users WHERE username='" + uname + "'";
		var cipher = crypto.createCipher(algorithm,passphrase);
		var crypted = cipher.update(pass,'utf8','hex');
		console.log(crypted);
		this.connection.query(queryString, function(err, rows, fields) {

			if (err) {
				throw err;
			}

			for (var i in rows) {
				if (crypted == rows[i].password) {

					callback({"result" : "OK"}, res);
					return;
				}
			}

			callback({"result" : "NOK"}, res);

		});

	};


	DbH.prototype.checkUserNameExists = function (uname, pass, res, callback) {

		// TODO: sql injection problems?

		var queryString = "SELECT * FROM users WHERE username='" + uname + "'";

		this.connection.query(queryString, function(err, rows, fields) {

			if (err) {
				throw err;
			}

			for (var i in rows) {
				callback({"result" : "EXIST"}, res);
				return;
			}

			callback({"result" : "NOTEXIST"}, res);
		});

	};


	DbH.prototype.addNewUser = function (user, res, callback) {

		// TODO: sql injection problems?

		var cipher = crypto.createCipher(algorithm,passphrase);
		user.password = cipher.update(user.password,'utf8','hex');
		this.connection.query('INSERT INTO users SET ?', user, function(err) {
			if (err) {
				console.log("DbH.prototype.addNewUser error: " + err);
				callback({"result" : "NOK"}, res);
			}
			else {
				callback({"result" : "OK"}, res);
			}
		});

	};


	// Initialize the module
    var dbH = new DbH();

    /* === Offer public API to this module: return public variables and methods === */    
    return dbH;

});


// Make it available outside this file
module.exports = DbHandler;