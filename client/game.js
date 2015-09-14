var global = this;


/* ==================================================================== */


// ----- Class: Game -----


// Constructor - prepares and makes the game
// Params: width, height (of initial(!) game board, can be changed later upon user selection)
// Returns: nothing

function Game(width, height) {

	// Scope of the game
	scope = this;

	// Global variables for height and width
	global.width = width;
	global.height = height;
	global.gameboardColor = 'white';
	global.hasFood = false;
	global.score=0;
	global.food=null;


	// --- Method inside constructor ---

	// Method: moveHere - sets target for a worm
	// Params: target (id of div)
	// Return: nothing

	//NOTE: must be global in order to work with gameboard generation script
	global.moveHere = function(target) {
		global.target = target;
	}


	// Method: startGame - draws worm to the gameboard
	// Params: nothing
	// Return: nothing

	// NOTE: must be inside constructor and before startGame trigger in order to work
	this.startGame = function() { 
		var worm1 = new Worm(scope, global.width/2, global.height/2, 5, 'blue', 400);
		//Check if there is existing food on the gameboard
		if(food==null){
		//Creates new food
		food = new Food(scope, 'red');
		food.draw();
		}
	}	


	// Method: generateGameboard - draws the game board
	// Params: width, height (of game board)
	// Return: nothing

	// NOTE: must be inside constructor and before called in order to work
	this.generateGameboard = function() { 

		gameboard = '<div id="gameboard">';

		for(var y=0;y<height;y++) {
			gameboard+='<div class="row">';
			for(var x=0;x<width;x++) {
				var id=x+'_'+y;
				var id_hipsuilla="'"+id+"'"; // using event listener for mouse clicks would require a totally different gameboard generation script
				var grid = '<div id="' + id + '"title="' + id + '" class="cell" onclick="moveHere('+id_hipsuilla+');"></div>';
				gameboard+=grid;
			}
			gameboard += '</div>';
		}

		gameboard+='</div>';

		document.getElementById('gameboard').innerHTML = gameboard;
	}


	// Method: drawToBoard - draws a single tile of board
	// Params: pos (position; id of div)
	// Returns: nothing

	this.drawToBoard  = function(pos, color) { 
		document.getElementById(pos).style.backgroundColor = color;
	}


	// --- Other constructor tasks ---

	// Generate an initial gameboard
	this.generateGameboard();

	// Make startGame trigger
    document.getElementById("play").addEventListener('click', this.startGame, true);

};

/* ==================================================================== */


// ----- Class: Worm -----


// Construtor - generates worm and it's behaviour
// Params: array of positions, length, color
// Return: nothing

function Worm(scope, startPosX, startPosY, length, color, speed) {

	that = this; // doesn't work with var that
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
		scope.drawToBoard(pos, that.color);
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


	// worm takes one step more
	scope.drawToBoard(nextX+'_'+nextY, that.color);
	that.position.push(nextX+'_'+nextY);

	// tail should follow
	scope.drawToBoard(that.position[0], global.gameboardColor);
	that.position = that.position.slice(1,that.position.length);

	//when worm hits apple
	if(food.foodPositionX == posX && food.foodPositionY == posY){
		//add one scorepoint
		score++;
		//just for testing
		console.log("Osuma"+score);
		//global food is set to null
		food=null;
		//setting the value of global food to a new instance of Food
		food=new Food(Game.scope,'red');
		//draw new food
		food.draw();
		document.getElementById('score').innerHTML= "Score: "+score;
	}


	//checking if the worm is going against the wall
	//some problems as it doesn't registrate the last row in it's position, but the one before it
	if(that.vectY<0 && posY==1)
	{
		console.log("kuolee");
	}
	if(that.vectY>0 && posY==18)
	{
		console.log("kuolee");
	}
	if(that.vectX<0 && posX==1)
	{
		console.log("kuolee");
	}
	if(that.vectX>0 && posX==18)
	{
		console.log("kuolee");
	}

};

/* ==================================================================== */


// ----- Class: Food -----

// Construtor - generates food and it's color
// Params: scope and color
// Return: nothing

function Food(scope, color) {
	this.scope=scope;
	this.color=color;
	this.foodPositionX=0;
	this.foodPositionY=0;
	this.foodPosition=0;


// Method: draw - generates a random position for food and draws it to gameboard
// Params: nothing
// Return: nothing

Food.prototype.draw=function(){}
	var badLocation=true;
	while(badLocation){
		this.foodPositionX = Math.floor(Math.random()*global.width);
		this.foodPositionY = Math.floor(Math.random()*global.height);
		this.foodPosition = this.foodPositionX+'_'+this.foodPositionY;
		for(var i=0;i<that.position.length;i++){
			if (that.position[i] == this.foodPosition){
				console.log("Apples position inside snake");
				badLocation=true;
				break;
			}
			else{
				badLocation=false;
			}
		}
	}
	document.getElementById(this.foodPosition).style.backgroundColor = this.color;
}




