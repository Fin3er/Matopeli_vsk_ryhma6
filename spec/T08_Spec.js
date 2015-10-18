/*
	T08 Preconditions:
	1. The system is running
	2. There exists user account in the system (exception: now will be created in beginning of T08)
*/

describe("T08: User login with invalid username or password", function (done) {

	var scope = this;

	beforeAll(function (done) {

		scope.querystring = require('querystring');
		scope.http = require('http');

		scope.un1 = "testiheikki";
		scope.pw1 = "T08E17ST"
		scope.un2 = "testimatti";
		scope.pw2 = "T08r71TS"

		var longdata = ""; // length to be 10000 characters

		for (var i=0; i<100; i++) {
			// add 100 characters
			longdata += "bX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dWbX18cY27dW";
		}

		scope.testdata = [  // testdata a-g; keep them in this order, otherwise test doesn't work correctly
			{un: scope.un1, pw: '27dW38eV'},
			{un: 'fU54gT6', pw: scope.pw1},
			{un: '', pw: scope.pw1},
			{un: scope.un2, pw: scope.pw1},
			{un: scope.un1, pw: longdata},
			{un: scope.un1+'%20or%201%3D1', pw: scope.pw1},
			{un: ')%20or%20true--', pw: '18cY27dW'}
		];

		//generate testdata username list that can be used with sql queries
		scope.sqlUsernames = "username='"+scope.un1+"' OR username='"+scope.un2+"' OR username='fU54gT6'";

		// counter of arrays
		scope.finishedRequests = 0;

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
				expect(data.response).toEqual(scope.thisTestVal);
				expect(scope.theresNoErrors).toBe(true);
				scope.finished = true;
			});

			res.on('error', function(err) {
	    		scope.theresNoErrors = false;
	    		expect(data.response).toEqual("NOK");
	    		expect(scope.theresNoErrors).toBe(true);
	    		scope.finished = true;
			});
		};

		// common for all tests
  		scope.getOptionsRegister = function (un, pw) {
  			return {
		    host: '127.0.0.1',
		    port: 8080,
		    path: '/api/user/register?username='+un+'&password='+pw,
		    method: 'GET'
			}
		};

		// common for all tests
  		scope.getOptionsLogin = function (un, pw) {
  			return {
		    host: '127.0.0.1',
		    port: 8080,
		    path: '/api/user/login?username='+un+'&password='+pw,
		    method: 'GET'
			}
		};

		// we need to wait for numerous async loops to finish, otherwise we'll get wrong expectations
  		// couldn't find any other way to do this with Jasmine?!?
		scope.startWaiting = function (done) {
			var waiting = setInterval(function () {
				if (scope.finished) {
					scope.finishedRequests++;
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
		var queryString = "DELETE FROM users where "+scope.sqlUsernames;

		scope.connection.query(queryString, function (err) {

			if (err) console.log(err);
			
			scope.connection.end();

			// mark async operation has finished
			done();
		});	
		
	});

  	// ---------------------------------


  	it(": register test username 1", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "OK";

  		scope.http.request(scope.getOptionsRegister(scope.un1, scope.pw1), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": register test username 2", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "OK";

  		scope.http.request(scope.getOptionsRegister(scope.un2, scope.pw2), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

// this test should be first one, after test registrations
    it(": login correct username and incorrect password", function (done) {

    	// reset counter of arrays, after test registrations
		scope.finishedRequests = 0;
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login incorrect username and correct password", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login empty username and correct password", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login some other user's correct username and own correct password", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login correct username and incorrect misc password of length 10000 characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login correct username + sql injection string '' or 1=1' and correct password", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": login username as only sql injections string ”') or true--” and incorrect password", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;
  		scope.thisTestVal = "NOK";

  		scope.http.request(scope.getOptionsLogin(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });


});