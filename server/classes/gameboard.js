
/* ==================================================================== */

// ----- Class: GameBoard -----

// Objectives: creating and modifying the gameboard as an object and game interface

/* ==================================================================== */


var GameBoard = (function (width, height) {

	// * Constructor GameBoard(params) [generates the game board] *
	// Params: int width, int height [in cells of game board]
	// Returns: void

	function gameB() {

		// storage for private variables
    	var priv = { };

		priv.foodPosY; //declared here so we can access from Game.js :59 evalWormMove(){}
		priv.foodPosX;
		priv.width=width; 
		priv.height=height;  
		
		// * Private properties *
		priv.cellTypes = {  // name: value
			'empty': 'empty_cell',
			'basicfood': 'food_cell',
			'superfood': 'superfood_cell',
			'worm_1': 'worm_1_cell',
			'worm_2': 'worm_2_cell',
			'worm_3': 'worm_3_cell',
			'worm_4': 'worm_4_cell'
		}

		// Container for gameboard contents
		priv.theBoard = {};

		// * Privileged public method getCellTypes() *
		// params: none
		// return: object cellClasses
		this.getCellTypes = function() {
			return priv.cellTypes;
		}

		// * Privileged public method getBoard() *
		// params: none
		// return: object theBoard
		this.getBoard = function() {
			return priv.theBoard;
		}

		// * Public properties *
		this.hasFood = false;


		// * Private method formatGameboard() *
		// params: none
		// return: array formatted gameboard
		priv.formatGameboard = function() {

			var b = {};

			for (var y=0;y<height;y++) {
				for (var x=0;x<width;x++) {
					b[x+'_'+y] = 'empty'};
				}

			return b;
		}


		// * Public method drawToBoard(params) [draws array of x_y positions to the gameBoard] *
		// Params: positions in format {'x_y': cellType, 'x_y': cellType}
		// Returns: void

		this.drawToBoard = function(positions) {

			// update gameboard object in server side
			for(var pos in positions) {
				priv.theBoard[pos] = positions[pos];
			}

			// let's update interfaces of clients, too!
			// TODO: it may be necessary to move client updates to somewhere else from here
			scope.gs.ws.drawToBoard(positions);
		}


		// --- Other constructor tasks ---

		// creates empty gameboard
		priv.theBoard = priv.formatGameboard();
	}


	// * Public method addFood(params) [generates a random position for food and draws it to the gameboard]
	// Params: string foodType [one of cells determined in gameboard class]
	// Return: void

	gameB.prototype.addFood = function(foodType){

		var badLocation=true;

		while (badLocation) {

			priv.foodPosX = Math.floor(Math.random()*priv.width);  
			priv.foodPosY = Math.floor(Math.random()*priv.height);
			var foodPosition = this.foodPosX+'_'+this.foodPosY;

			for(var i=0; i<scope.worm.getPosition().length; i++){

				if (scope.worm.getPosition()[i] == foodPosition){
					console.log("Apples position inside snake");
					badLocation=true;
					break;
				}

				else{
					badLocation=false;
				}

			}
		}

		this.drawToBoard(foodPosition, foodType);
	}


	// * Public method setScore(params) [sets score of the game to the browser screen]
	// Params: int score
	// Returns: void

	gameB.prototype.setScore = function(score) { 

		
		//document.getElementById('score').innerHTML= "Score: "+score;
	}


	// * Public method getPositionInfo(params) [provides info what exist in that position in the game board]
	// Params: int posX, int posY
	// Return: object [info what is in that position on gameboard]

	gameB.prototype.getPositionInfo = function(posX,posY) {

		position = posX+'_'+posY;
		var posInfo = '';
		

	//TODO: check here, if position is outside the gameboard, or collides other worm or food, etc

		return {
			'position': position, 'value': posInfo
		};

	// return values: worm / empty / outside / food ?
	};

		// Initialize the module
	    var gameb = new gameB();

	    /* === Return public variables and methods of this module === */    
	    return gameb;

 });



// Make it available outside this file
module.exports = GameBoard;