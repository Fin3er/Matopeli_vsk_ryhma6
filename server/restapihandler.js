/* ==================================================================== */

// ----- Module: RestAPIHandler -----

// Objectives: handles everything related to http rest api

/* ==================================================================== */


var RestAPIHandler = (function (scope) {


	// * Constructor RestAPI() [inits the rest api] *
	// Params: nothing
	// Returns: void

	function RestAPI() {

		// storage for private variables
        var priv = { };

        scope.restResOK = function (msg) {
        	return {
        		"response": "OK",
				"message": msg
			}
        }

        scope.restResNOK = function (msg) {
        	return {
        		"response": "NOK",
				"message": msg
			}
        }

        scope.validateUsername = function (un) {
        	if (un.length >= 4 && un.length <= 16) {
        		return /^[a-zA-Z0-9]*$/.test(un);
        	}
        	return false;
        }

        scope.validatePassword = function (pw) {
        	if (pw.length >= 8 && pw.length <= 16) {
        		return /^[a-zA-Z0-9]*$/.test(pw);
        	}
        	return false;
        }


		/*	=================================
			   API: user
			   for: user related actions
			================================= */

		/*  ---------------------------------
			path: api/user/login
			method: get
			objective: login user to system
			response: OK = login successful, NOK = login failed
			--------------------------------- */

		scope.app.get('/api/user/login', this.userLogin);


		/*	---------------------------------
			path: api/user/register
			method: get
			objective: register user to system
			response: OK = registration successful, NOK = registration failed
			--------------------------------- */

		scope.app.get('/api/user/register', this.userRegister);

	}


	RestAPI.prototype.userLogin = function (req, res) {

		// storage for private variables
        var priv = { };

		priv.uname = req.query['username'];
		priv.pass = req.query['password'];

		if (!(validateUsername(priv.uname) && validatePassword(priv.pass))) {
			res.send(scope.restResNOK("Login failed. Username or password contained invalid characters (other than a-z, A-Z, 0-9) or was too short or long."));
			return;
		}

		// TODO: login user with the game too ;)

		scope.gs.db.checkUserPassword(priv.uname, priv.pass, res, function (dbr, res) {

			switch (dbr.result) {

				case "OK":
					// create a logged-in player to the system
					scope.gs.createPlayer(priv.uname);

					// tell it to client, too
					res.send(scope.restResOK("Login successful"));
					break;

				case "NOK":
				default:
					res.send(scope.restResNOK("Login failed. Username or password was wrong."));
					break;
			}
		});

	};


	RestAPI.prototype.userRegister = function (req, res) {

		// storage for private variables
        var priv = { };

		priv.uname = req.query['username'];
		priv.pass = req.query['password'];

		if (priv.pass == "" || priv.uname == "") {
			res.send(scope.restResNOK("Username / password can't be empty!"));
		}

		if (!(validateUsername(priv.uname) && validatePassword(priv.pass))) {
			res.send(scope.restResNOK("Login failed. Username or password contained invalid characters (other than a-z, A-Z, 0-9) or was too short or long."));
			return;
		}

		else {

			scope.gs.db.checkUserNameExists(priv.uname, priv.pass, res, function (dbr, res) {

				switch (dbr.result) {

					case "EXIST":
					default:
						res.send(scope.restResNOK("Please select another username!"));
						break;

					case "NOTEXIST":
						
						scope.gs.db.addNewUser({ username: priv.uname, password: priv.pass }, res, function (dbr, res) {

							switch (dbr.result) {
								case "OK":
									res.send(scope.restResOK("Thank you, you have registered!"));
									break;
								case "NOK":
								default:
									res.send(scope.restResNOK("Registration failed!"));
									break;
							}
						});
						break;
				}
			});
		}
	};

	// Initialize the module
    var rest = new RestAPI();

    /* === Return public variables and methods of this module === */    
    return;

});


// Make it available outside this file
module.exports = RestAPIHandler;