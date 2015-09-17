/* ==================================================================== */

// ----- Class: Worm -----

// Objectives: handles the worm as an object

/* ==================================================================== */


// * Constructor Worm(params) [generates worm and it's behaviour]
// Params: string wormId [=cellType according to gameboard class], int startPosX, int startPosY, int length [just initial length], int speed [just initial speed]
// Return: nothing

//TODO !!!!Fix !!! Worm's speed doubles after "play" button is pressed second time for reset of game (in index.html)!!!

function Worm(wormId, startPosX, startPosY, length, speed) {

	//that is local scope of the class Worm
	//that = this;


	// * Private properties *
	var position = []; // array of positions string x_y where worm is located
	var wormId = wormId; // string wormId according to cellType of gameboard class
	var length = length; // int length in positions
	var startPosX = startPosX; // int start position x of worm's tail
	var startPosY = startPosY; // int start position y of worm's tail
	var speed = speed; // int speed of worm in milliseconds = how quickly it goes one position ahead
	var interval = {}; // placeholder of interval object for reference
	var direction = '0_0'; // string x_y of worm's target position // TODO: make this random?
	var vectX = 1; // x distance & direction to target position // TODO: make this random?
	var vectY = 1; // y distance & direction to target position // TODO: make this random?


	// * Public static properties *
	global.target = '0_0'; // TODO: make these random?


	// * Privileged public method getSpeed() *
	// params: none
	// return: int speed
	this.getSpeed = function() {
		return speed;
	};

	console.log(this.getSpeed);
	// * Privileged public method getPosition() *
	// params: none
	// return: int speed
	this.getPosition = function() {
		return position;
	};


	// * Privileged public method draw() [draws worm to the gameboard] *
	// params: none
	// return: void
	this.draw = function() {
		position.forEach(function(pos) {
			scope.gameBoard.drawToBoard(pos, wormId);
		});
	};


	// * Privileged public method move() [moving worm to a direction]
	// Params: nothing
	// Return: void

	this.move = function() {

		// get x, y coordinates of now
		var posNow = position[position.length-1];

		var pos = posNow.split('_');
		var posX = parseInt(pos[0]);
		var posY = parseInt(pos[1]);
		var nextX = '';
		var nexty = '';


		if (direction != global.target) {
			
			//new direction is set
			direction = global.target;

			// get x, y coordinates of direction
			var dir = direction.split('_');
			var dirX = parseInt(dir[0]);
			var dirY = parseInt(dir[1]);

			// where to take direction
			// the same direction is kept as long as user doesn't change it
			vectX = dirX-posX;
			vectY = dirY-posY;

			console.log(vectX+'_'+vectY);
		}

		// let's go to direction that is more far away
		if (Math.abs(vectX) > Math.abs(vectY)) {
			if (vectX > 0) {
				nextX = posX+1;
			}
			else {
				nextX = posX-1;
			}
			nextY = posY;
		}
		else {
			if (vectY > 0) {
				nextY = posY+1;
			}
			else {
				nextY = posY-1;
			}
			nextX = posX;
		}


		// TODO: here find out, can worm move? yes or no? or did it eat? 

		result = scope.evalWormMove(nextX, nextY, wormId);


		if (result.wormDestiny == 'eat') {
			//this.eat(); No need to do because setScore sets score at game.js
		}


		// --- OK, worm can move, so let's move it ---

		if (result.wormDestiny == 'go-on') { // if the result was 'eat', tail is not removed = worm grows

			// first we move the tail (draw empty first, move tail then
			scope.gameBoard.drawToBoard(position[0], 'empty');
			position = position.slice(1,position.length);
		}

		if (result.wormDestiny == 'go-on' || result.wormDestiny == 'eat') {

			// then we move the head (move head first, draw worm then)
			position.push(nextX+'_'+nextY);
			this.draw();
		}

	};


	// * Private method eat() * 
	// params: ?
	// return: ?
	var eat = function() {

	// TODO   
	// more score? not here, rather in game logic, maybe <-- already done in Game.js :34 + GameBoard.js :119 
	// more lenght? skip tail removal?
	// more speed? interval = ...

	};


	// * Private method init() [generates initial worm and sets it moving] *
	// params: none
	// return: void
	var init = function() {

		for(var i=0;i<length;i++) {
			position.push(startPosX+'_'+(startPosY+i));
		}

		interval = setInterval(function () {
			scope.worm.move();}, speed);
	};


	// --- Other constructor tasks ---
	
	init(); // generate initial worm
	this.draw(position, wormId); // draw the worm initially
}