/*
	T03 Preconditions:
	1. The system is running
*/

describe("T03: User registration to database with parameters from invalid equivalence classes", function (done) {

	var scope = this;

	beforeAll(function (done) {

		scope.querystring = require('querystring');
		scope.http = require('http');

		scope.testdata = [  // testdata a-j; keep them in this order, otherwise test doesn't work correctly
			{un: 'aZ0', pw: 'bX18cY27dW38eV46'},
			{un: 'aZ08fU54gT63hS720', pw: 'bX18cY27'},
			{un: 'aZ48', pw: 'bX18cY27dW38eV460'},
			{un: 'aZ09fU54gT63hS73', pw: 'bX18cY2'},
			{un: 'aZ-8', pw: 'bX18cY27dW38eV46'},
			{un: 'aZ09fU54gT63hS74', pw: 'bX18cY27'},
			{un: 'a-0', pw: 'bX18cY27dW38eV46'},
			{un: 'aZ4o', pw: 'bX18_Y27dW38-V43r'},
			{un: 'aZ0-', pw: 'bX18_Y27dW38-V46'},
			{un: 'aZ08fU54gT63h-720', pw: 'bX1-cY2'}
		];

		//generate testdata username list that can be used with sql queries
		scope.sqlUsernames = "username='"+scope.testdata[0].un+"'";
		for (var i=1; i<scope.testdata.length; i++) {
			scope.sqlUsernames += " OR username='"+scope.testdata[i].un+"'";
		}

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
				expect(data.response).toEqual("NOK")
				expect(scope.theresNoErrors).toBe(true);
				scope.finished = true;
			});

			res.on('error', function(err) {
	    		scope.theresNoErrors = false;
	    		expect(data.response).toEqual("NOK")
	    		expect(scope.theresNoErrors).toBe(true);
	    		scope.finished = true;
			});
		};

		// common for all tests
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


  	it(": username length 3 valid characters, password length 16 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 17 valid characters, password length 8 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 4 valid characters, password length 17 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 16 valid characters, password length 7 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 4 invalid characters, password length 16 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 16 valid characters, password length 8 invalid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 3 invalid characters, password length 16 valid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 4 valid characters, password length 17 invalid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 3 invalid characters, password length 16 invalid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });

    it(": username length 17 invalid characters, password length 7 invalid characters", function (done) {
  		
  		scope.theresNoErrors = true;
  		scope.finished = false;

  		scope.http.request(scope.getOptions(scope.testdata[scope.finishedRequests].un, scope.testdata[scope.finishedRequests].pw), scope.testResponse).end();
  		
  		scope.startWaiting(done);
    });




    it(": none of the tested usernames were found from database", function (done) {

    	var queryString = "SELECT * from users where username='"+scope.testdata.un1+"' OR username='"+scope.testdata.un2+"'";

		scope.connection.query(queryString, function (err, rows, fields) {

			if (err) console.log(err);

			// there should be 2 users with this query
			expect(rows.length).toEqual(0);

			done();
		});	
  		
    });

});