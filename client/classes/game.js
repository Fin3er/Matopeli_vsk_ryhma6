/* ==================================================================== */

// ----- Class: Game -----
// Contains: game logic

/* ==================================================================== */

// Constructor - prepares and lauches the game
// Params: width, height of game board
// Returns: nothing

function Game(width, height) {

	// this is the scope (like "namespace") of the game; should be accessed only by scripts inside the game
	scope = this;

	// how much score in this game?
	this.score = 0;

	// let's have a new gameboard for this game session
	this.gameBoard = new GameBoard(width, height);

	// this time just one new worm to the game
	// Params: scope, wormId, startPosX, startPosY, length, speed
	this.worm = new Worm(scope, 'worm_1', global.width/2, global.height/2, 5, 400);

	//Check if there is existing food on the gameboard
	if (this.gameBoard.hasFood == false) {

		//Adds some new food, initially
		this.gameBoard.addFood('basicfood');
	}

};


// Method: eat - this happens to worm, when it ets
// Params: pos wormId
// Return: ?

Game.prototype.evalWormMove = function(pos, wormId) {


	result = scope.gameBoard.getPositionInfo(nextX+'_'+nextY);

// TODO: create game logic here: game over? some collision? more score?


/*
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
*/

	scope.gameBoard.setScore(scope.score);


	//return result;
	return 'go-on';


// return: go-on, eat, gameover, etc?

}