/*
	T01 Preconditions:
	1. Database server is running.
	2. There is registered users in the database.
*/

describe("T01: Username is unique and can be found from the database", function (done) {

	var scope = this;

    beforeAll(function (done) {

    	/* === set up mysql server === */
    	scope.mysql = require('mysql');

	    scope.connection = scope.mysql.createConnection(require(__dirname+'/../dbconfig.js'));   

	    scope.connection.connect(function (err) {
	        if (err) console.log("Failed to connect MySQL server!");
	        //else console.log("Connected to MySQL server!");
	    });

	    var queryString = "SELECT * FROM users";
		scope.connection.query(queryString, function (err, rows, fields) {

			// save data to variables, for actual tests
			scope.err = err;
			scope.rows = rows;
			scope.fields = fields;

			// mark async operation has finished
			done();
		});

  	});


	afterAll(function (done) {
		scope.connection.end();
		done();
	});

  	// ---------------------------------


  	it("has registered users in the database", function (done) {

  		// there shouldn't be a database error
    	expect(scope.err).not.toBe(true);

    	// there should be more than 0 rows in users table
  		expect(scope.rows.length > 0).toBe(true);

  		done();
    });


  	it("has each username in database exists once and only once", function (done) {

  		scope.hasFinished = false;
  		scope.rowCounter = scope.rows.length;
  		scope.usernamesAreUnique = true;
  		scope.theresNoErrors = true;

  		// loop through every user of all users
  		scope.rows.every(function (row) {

  			var queryString = "SELECT * FROM users where username='"+row.username+"'";
  			scope.connection.query(queryString, function (err, rows, fields) {
  				
  				if (err) {
  					scope.theresNoErrors=false;
  				}

  				if (rows.length > 1) {
  					scope.usernamesAreUnique=false;
  				}

  				// when the very last async call in the chain has finished, then it's done!
  				// couldn't find any other way to do this with Jasmine?!?
  				scope.rowCounter--;
  				if (scope.rowCounter <= 0) {
  					scope.hasFinished = true;
  				}

  			});

  			// loop doesn't break immediately, because query function is also async,
  			// but there's no way to return false to ever-loop from inside another async
  			if (scope.theresNoErrors && scope.usernamesAreUnique) {
  				return true; // true = continue every-loop
  			}
  			else {
  				scope.hasFinished = true;
  				return false; // false = break every-loop
  			}

  		});

  		// we need to wait for numerous async loops to finish, otherwise we'll get wrong expectations
  		// couldn't find any other way to do this with Jasmine?!?
		var waiting = setInterval(function () {
			if (scope.hasFinished) {

				// there shouldn't be a database error
		  		expect(scope.theresNoErrors).toBe(true);

		  		// all usernames should be unique
		  		expect(scope.usernamesAreUnique).toBe(true);

		  		done();
				
				clearInterval(waiting);
			}
		}, 100);	

    });

});