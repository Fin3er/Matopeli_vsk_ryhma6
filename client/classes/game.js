/* ==================================================================== */

// ----- Class: Game -----

// Objectives: start and end the game, and game logic

/* ==================================================================== */


// * Constructor Game(params) [loads and launches the game] *
// Params: int width, int height (of game board)
// Returns: void

function Game(width, height) {


	// * Public references *
	scope = this; // this is the scope (like "namespace") of the game; should be accessed only by scripts inside the game

	// * Private properties *
	var score = 0; // NOTE: later move this to player class

	// * Privileged public method getScore() *
	// params: none
	// return: int score
	this.getScore = function() {
		return score;
	}

	// * Privileged public method addScore() *
	// params: none
	// return: void
	this.addScore = function() {
		score++;
	}

	// * Public properties *
	
	this.gameBoard = new GameBoard(width, height); // Let's have a new gameboard for this game session	
	this.worm = new Worm('worm_1', width/2, height/2, 5, 400); // This time just one new worm to the game Params: scope, wormId, startPosX, startPosY, length, speed


	// --- Other constructor tasks ---

	//Check if there is existing food on the gameboard
	if (this.gameBoard.hasFood == false) {
		
		this.gameBoard.addFood('basicfood'); //Adds some new food, initially
	};

};


// * Public method: evalWormMove(params) [what happens to worm, when it takes this step]
// Params: int posX, int posY, string wormId [id of worm]
// Return: object.wormDestiny [this will happen to the worm]

Game.prototype.evalWormMove = function(posX, posY, wormId) {


	result = scope.gameBoard.getPositionInfo(posX, posY);

// TODO: do something with results - create game logic here: game over? some collision? more score?


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

	scope.gameBoard.setScore(this.getScore());

	//return result - options: go-on, eat, gameover, etc?
	return {
		'wormDestiny': 'go-on'
	};

}