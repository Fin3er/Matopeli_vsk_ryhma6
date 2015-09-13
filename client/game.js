var global = this;

// ----- Class: Worm -----

// Construtor
// Params: array of positions, length, color
// Return: nothing

function Worm(startPosX, startPosY, length, color) {

	that = this;
	that.position = [];
	that.length = length;
	that.color = color;
	that.startPosX = startPosX;
	that.startPosY = startPosY;

	// generate initial worm
	this.init();


	// draw the worm
	this.draw();
}

// Method: init - generates initial worm
// Params: nothing
// Return: nothing

Worm.prototype.init = function() {
	for(var i=0;i<that.length;i++) {
		this.position.push(that.startPosX+'_'+(that.startPosY+i));
	}
};

// Method: draw - draws worm to the gameboard
// Params: nothing
// Return: nothing

Worm.prototype.draw = function() {

	this.position.forEach(function(pos) {
		document.getElementById(pos).style.backgroundColor = that.color;
	});
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
				var grid = '<div id="' + id + '"title="' + id + '" class="cell"></div>';
				gameboard+=grid;
			}
			gameboard += '</div>';
		}

		gameboard+='</div>';


	document.getElementById('gameboard').innerHTML = gameboard;

};


// ----- Class: Game -----
//

// Constructor - launches the game session
// Params: nothing
// Returns: nothing

var Game = function() {
	// place worms to the game
	var worm1 = new Worm(global.width/2, global.height/2, 5, 'blue');
}


// Method: drawToBoard - draws a single tile of board
// Params: posX, posY, color
// Returns: nothing

Game.prototype.drawToBoard = function(posX, posY, color) {

	var pos = posX+'_'+posY;
	document.getElementById(pos.style.backgroundColor) = color;
};


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
