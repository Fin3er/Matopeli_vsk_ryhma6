/* ==================================================================== */

// ----- Class: Worm -----
// Contains: handles the worm as an object

/* ==================================================================== */

// Construtor - generates worm and it's behaviour
// Params: scope, wormId (=classType), start x position, start y position, initial length, initial speed
// Return: nothing

function Worm(scope, wormId, startPosX, startPosY, length, speed) {

	//that is local scope of the class Worm
	that = this;
	
	this.position = [];
	this.wormId = wormId;
	this.length = length;
	this.startPosX = startPosX;
	this.startPosY = startPosY;
	this.speed = speed;
	this.interval = {};

	// TODO: make these random?
	global.target = '0_0';
	this.direction = '0_0';
	this.vectX = 1;
	this.vectY = 1;

	// generate initial worm
	this.init();

	// draw the worm initially
	this.draw(this.position, this.wormId);
}


// Method: init - generates initial worm and sets it moving
// Params: nothing
// Return: nothing

Worm.prototype.init = function() {

	for(var i=0;i<that.length;i++) {
		that.position.push(that.startPosX+'_'+(that.startPosY+i));
	}

	that.interval = setInterval(function () {that.move()}, that.speed);
};


// Method: draw - draws worm to the gameboard
// Params: position, wormType
// Return: nothing

Worm.prototype.draw = function() {

	that.position.forEach(function(pos) {
		scope.gameBoard.drawToBoard(pos, that.wormId);
	});
};


// Method: move - moving worm to a direction
// Params: nothing
// Return: nothing

Worm.prototype.move = function() {

	if (that.direction != global.target) {
		//new direction is set
		that.direction = global.target;

		// get x, y coordinates of direction
		dir = that.direction.split('_');
		dirX = parseInt(dir[0]);
		dirY = parseInt(dir[1]);

		// where to take direction
		// the same direction is kept as long as user doesn't change it
		that.vectX = dirX-posX;
		that.vectY = dirY-posY;
	}

	// get x, y coordinates of now
	posNow = that.position[that.position.length-1];

	pos = posNow.split('_');
	posX = parseInt(pos[0]);
	posY = parseInt(pos[1]);

	// let's go to direction that is more far away
	if (Math.abs(that.vectX) > Math.abs(that.vectY)) {
		if (that.vectX > 0) {
			nextX = posX+1;
		}
		else {
			nextX = posX-1;
		}
		nextY = posY;
	}
	else {
		if (that.vectY > 0) {
			nextY = posY+1;
		}
		else {
			nextY = posY-1;
		}
		nextX = posX;
	}


// TODO: here find out, can worm move? yes or no? or did it eat? 

	result = scope.evalWormMove(nextX+'_'+nextY, that.wormId);


	if (result == 'eat') {
		this.eat();
	}


	// --- OK, worm can move, so let's move it ---

	if (result == 'go-on') { // if the result was 'eat', tail is not removed = worm grows

		// first we move the tail (draw empty first, move tail then
		scope.gameBoard.drawToBoard(that.position[0], 'empty');
		that.position = that.position.slice(1,that.position.length);
	}

	if (result == 'go-on' || result == 'eat') {

		// then we move the head (move head first, draw worm then)
		that.position.push(nextX+'_'+nextY);
		this.draw();
	}

};


// Method: eat - this happens to worm, when it ets
// Params: ?
// Return: ?

Worm.prototype.eat = function() {

// TODO
// more score? not here, rather in game logic, maybe
// more lenght? skip tail removal?
// more speed? that.interval = ...

}