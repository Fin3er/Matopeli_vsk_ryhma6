/*
	T02 Preconditions:
	1. The system is running
	2. Used usernames doesn't exists already in the database
*/

describe("T02: User registration to database with parameters from valid equivalence classes", function (done) {

	var scope = this;

	beforeAll(function (done) {

		scope.querystring = require('querystring');
		scope.http = require('http');

		scope.testdata = { // this is not a good way, should be an array, to have n number of users to test
			un1: 'aZ09',
			pw1: 'bX18cY27dW38eV46',
			un2: 'aZ09fU54gT63hS72',
			pw2: 'bX18cY27'
		};

		// these must match with the ones in dbhandler.js (location is subject to change)
		scope.crypto = require('crypto'); // encryption cipher details
		scope.algorithm = 'aes-256-ctr';
		scope.passphrase = 'ffg66dfsd4f';

		// common for all tests
		scope.testResponse = function(res) {
			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			res.on('data', function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			res.on('end', function () {
				data = JSON.parse(str);
				expect(data.response).toEqual("OK")
				scope.finished = true;
			});

			res.on('error', function(err) {
	    		scope.theresNoErrors = false;
	    		scope.finished = true;
			});
		};

		scope.getOptions = function (un, pw) {
  			return {
		    host: '127.0.0.1',
		    port: 8080,
		    path: '/api/user/register?username='+un+'&password='+pw,
		    method: 'GET'
			}
		};

		// we need to wait for numerous async loops to finish, otherwise we'll get wrong expectations
  		// couldn't find any other way to do this with Jasmine?!?
		scope.startWaiting = function (done) {
			var waiting = setInterval(function () {
				if (scope.finished) {

					// there shouldn't be a request error
		  			expect(scope.theresNoErrors).toBe(true);

		  			done();		
					clearInterval(waiting);
				}
			}, 100)
		};


    	/* === set up mysql server === */

    	scope.mysql = require('mysql');

	    scope.connection = scope.mysql.createConnection(require(__dirname+'/../dbconfig.js'));   

	    scope.connection.connect(function (err) {
	        if (err) console.log("Failed to connect MySQL server!");
	        //else console.log("Connected to MySQL server!");
	        done();
	    });

  	});

	afterAll(function (done) {

		// testdata must be deleted in the end, otherwise the test doesn't work again
		var queryString = "DELETE FROM users where username='"+scope.testdata.un1+"' OR username='"+scope.testdata.un2+"'";

		scope.connection.query(queryString, function (err) {

			if (err) console.log(err);
			
			scope.connection.end();

			// mark async operation has finished
			done();
		});	
		
	});

  	// ---------------------------------


	it("username length 4 valid characters, password length 16 valid characters", function (done) {

		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.http.request(scope.getOptions(scope.testdata.un1, scope.testdata.pw1), scope.testResponse).end(); 		
  		scope.startWaiting(done);

	});


	it("username length 16 valid characters, password length 8 valid characters", function (done) {
		
		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.http.request(scope.getOptions(scope.testdata.un2, scope.testdata.pw2), scope.testResponse).end();
  		scope.startWaiting(done);

	});


    it("has all registered usernames in database", function (done) {

    	var queryString = "SELECT * from users where username='"+scope.testdata.un1+"' OR username='"+scope.testdata.un2+"'";

		scope.connection.query(queryString, function (err, rows, fields) {

			if (err) console.log(err);

			// there should be 2 users with this query
			expect(rows.length).toEqual(2);

			// save data for the next test
			scope.rows = rows;

			done();
		});	
  		
    });


    // NOTE: this spec must run after "has all registered usernames in database"
    it("has encrypted passwords in database that match with encrypted test passwords", function (done) {

    	var crypted;

    	for (var i = 0; i < scope.rows.length; i++) {

    		if (scope.rows[i].username == scope.testdata.un1) {

    			scope.cipher = scope.crypto.createCipher(scope.algorithm,scope.passphrase);
    			crypted = scope.cipher.update(scope.testdata.pw1,'utf8','hex');

    			// passwords match
    			expect(scope.rows[i].password == crypted).toBe(true);
    		}

    		if (scope.rows[i].username == scope.testdata.un2) {

    			scope.cipher = scope.crypto.createCipher(scope.algorithm,scope.passphrase);
    			crypted = scope.cipher.update(scope.testdata.pw2,'utf8','hex');

    			// passwords match
    			expect(scope.rows[i].password == crypted).toBe(true);
    		}

    	}
		  		
  		done();
    });

});