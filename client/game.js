var global = this;

// ----- Class: Worm -----

// Construtor
// Params: array of positions, length, color
// Return: nothing

function Worm(gameObj, startPosX, startPosY, length, color, speed) {

	that = this; // doesn't work with var that
	that.gameObj = gameObj;
	that.position = [];
	that.length = length;
	that.color = color;
	that.startPosX = startPosX;
	that.startPosY = startPosY;
	that.speed = speed;
	that.interval = {};
	
	// TODO: make these random
	that.direction = '0_0';
	global.target = '0_0';
	that.vectX = 1;
	that.vectY = 1;

	// generate initial worm
	this.init();

	// draw the worm
	this.draw();
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
// Params: nothing
// Return: nothing

Worm.prototype.draw = function() {

	that.position.forEach(function(pos) {
		that.gameObj.drawToBoard(pos, that.color);
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


	// grow the worm
	document.getElementById(nextX+'_'+nextY).style.backgroundColor = that.color;
	that.position.push(nextX+'_'+nextY);


	// tail should follow
	document.getElementById(that.position[0]).style.backgroundColor = 'white';
	that.position = that.position.slice(1,that.position.length);

};


/* ==================================================================== */


// ----- Class: GameBoard -----

// Constructor - draws game board
// Params: width, height (of game board)

var GameBoard = function(width, height) {

	global.width = width;
	global.height = height;

		gameboard = '<div id="gameboard">';

		for(var y=0;y<height;y++) {
			gameboard+='<div class="row">';
			for(var x=0;x<width;x++) {
				var id=x+'_'+y;
				var id_hipsuilla="'"+id+"'";
				var grid = '<div id="' + id + '"title="' + id + '" class="cell" onclick="moveHere('+id_hipsuilla+');"></div>';
				gameboard+=grid;
			}
			gameboard += '</div>';
		}

		gameboard+='</div>';


	document.getElementById('gameboard').innerHTML = gameboard;

};


/* ==================================================================== */


// ----- Class: Game -----
//

// Constructor - launches the game session
// Params: nothing
// Returns: nothing

function Game() {

	// place worms to the game
	var worm1 = new Worm(this, global.width/2, global.height/2, 5, 'blue', 400);

}


// Method: drawToBoard - draws a single tile of board
// Params: posX, posY, color
// Returns: nothing

Game.prototype.drawToBoard = function(pos, color) {
	document.getElementById(pos).style.backgroundColor = color;
};

/*
Game.prototype.drawToBoard = function(posX, posY, color) {

	var pos = posX+'_'+posY;
	document.getElementById(pos).style.backgroundColor = color;
};
*/

// -------------------------------------------

function moveHere(target) {
	global.target = target;
}

// -------------------------------------------

// TODO

function newFood() {
	var color='red';
	var badLocation=true;
	while(badLocation){
		var foodPosition = Math.floor(Math.random()*399);
		for(var i=0;i<snakePosition.length;i++){
			if (snakePosition[i] == foodPosition){
				console.log("Apples position inside snake");
				badLocation=true;
				break;
			}
			else{
				badLocation=false;
			}
		}
	}
	document.getElementById(foodPosition).style.backgroundColor = color;
}
