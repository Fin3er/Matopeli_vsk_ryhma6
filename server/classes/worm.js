/* ==================================================================== */

// ----- Class: Worm -----

// Objectives: handles the worm as an object

/* ==================================================================== */


// * Constructor Worm(params) [generates worm and it's behaviour]
// Params: string wormId [=cellType according to gameboard class], int startPosX, int startPosY, int length [just initial length], int speed [just initial speed]
// Return: nothing

function Worm(wormId, startPos, startTarget, wormLength) {

	// * Private properties *
	
	// storage for private variables
	var priv = {};

	priv.wormPositions = []; // array of positions string x_y where worm is located, in order: from tail to head
	priv.wormId = wormId; // string wormId according to cellType of gameboard class
	priv.wormLength = wormLength; // int length in positions
	priv.startPos = startPos; // int start position x_y of worm's tail
	priv.target = startTarget; // string x_y of worm's target position
	priv.vectX = 1; // x distance & direction to target position // TODO: make this random?
	priv.vectY = 1; // y distance & direction to target position // TODO: make this random?
	priv.givenTarget = startTarget; // string x_y of worm's target position that can be updated any time by client


	// * Privileged public method getPositions() *
	// params: none
	// return: positions in format {'x_y': cellType, 'x_y': cellType}
	this.getPositions = function() {

		var wormp = {};

		for (var i=0; i<priv.wormPositions.length; i++) {
			wormp[priv.wormPositions[i]] = priv.wormId;
		}

		return wormp;
	};


	// * Privileged public method setTarget(target) *
	// params: none
	// return: int speed
	this.setTarget = function(target) {
		priv.givenTarget = target;
	};


	// * Privileged public method moveWorm() [moving worm to a direction]
	// Params: nothing
	// Return: void

	this.moveWorm = function() {

		// get x, y coordinates of now
		var posNow = scope.gs.posToCoords(priv.position[priv.position.length-1]);
		var posX = posNow.x;
		var posY = posNow.y;	

		var nextX = '';
		var nexty = '';


		if (priv.target != priv.givenTarget) {
			
			//new direction is set
			priv.target = priv.givenTarget;

			// get x, y coordinates of new direction
			var tarNow = scope.gs.posToCoords(priv.target);
			var tarX = tarNow.x;
			var tarY = tarNow.y;	

			// where to take direction
			// the same direction is kept as long as user doesn't change it
			vectX = tarX-tarX;
			vectY = tarY-tarY;
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


		

/*		// TODO: here find out, can worm move? yes or no? or did it eat? what then happens?

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

		if (result.wormDestiny == 'die')
		{
			
		}
*/

	};


/*
	// * Private method eat() * 
	// params: ?
	// return: ?
	var eat = function() {

	// TODO   
	// more score? not here, rather in game logic, maybe <-- already done in Game.js :34 + GameBoard.js :119 
	// more lenght? skip tail removal?
	// more speed? interval = ...

	};
*/


/*
	// * Private method die() * 
	// params: ?
	// return: ?
	var die = function() {

	// TODO   

	};
*/


	// * Private method generateWorm() [generates initial worm to gameboard] *
	// params: none
	// return: array generated worm positions list in format ['x_y', 'x_y', 'x_y']
	priv.generateWorm = function() {

		// get x, y coordinates of worm's tail initially
		var posNow = scope.gs.posToCoords(priv.startPos);
		var posX = posNow.x;
		var posY = posNow.y;

		var wormp = [];

		for(var i=0; i<wormLength; i++) {
			wormp.push(posX+'_'+(posY+i));
		}

		return wormp;
	}


	// --- Other constructor tasks ---
	
	priv.wormPositions = priv.generateWorm(); // generate initial worm

}

// Make it available outside this file
module.exports = Worm;