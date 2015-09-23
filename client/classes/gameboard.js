
/* ==================================================================== */

// ----- Class: GameBoard -----

// Objectives: creating and modifying the gameboard as an object and game interface

/* ==================================================================== */


// * Constructor GameBoard(params) [generates the game board] *
// Params: int width, int height [in cells of game board]
// Returns: void


function GameBoard(width, height) {


	this.foodPosY; //declared here so we can access from Game.js :59 evalWormMove(){}
	this.foodPosX;
	this.width=width; 
	this.height=height;  
	// * Private properties *
	var cellTypes = {  // name: value
		'empty': 'empty_cell',
		'basicfood': 'food_cell',
		'superfood': 'superfood_cell',
		'worm_1': 'worm_1_cell',
		'worm_2': 'worm_2_cell',
		'worm_3': 'worm_3_cell',
		'worm_4': 'worm_4_cell'
	}

	// * Privileged public method getCellTypes() *
	// params: none
	// return: object cellClasses
	this.getCellTypes = function() {
		return cellTypes;
	}

	// * Public properties *
	this.hasFood = false;

	// * Private method generateGameboard() *
	// params: none
	// return: string [gameboard html code]
	var generateGameboard = function() {
		var gameboard = '<div id="gameboard">';

		for(var y=0;y<height;y++) {
			gameboard+='<div class="row">';
			for(var x=0;x<width;x++) {
				var id=x+'_'+y;
				var id_hipsuilla="'"+id+"'"; // using event listener for mouse clicks would require a totally different gameboard generation script
				var grid = '<div id="' + id + '"title="' + id + '" class="empty_cell" onclick="moveHere('+id_hipsuilla+');"></div>';
				gameboard+=grid;
			}
			gameboard += '</div>';
		}

		return gameboard+='</div>';
	}


	// --- Other constructor tasks ---

	document.getElementById('gameboard').innerHTML = generateGameboard(); // creates gameboard to browser screen
}


// * Public method drawToBoard(params) [draws "anything" to the cell of the game] *
// Params: string pos (position; id of div), string cellType [one of cells determined in gameboard class]
// Returns: void

GameBoard.prototype.drawToBoard = function(pos, cellType) { 
	
	document.getElementById(pos).className = this.getCellTypes()[cellType];
}


// * Public method addFood(params) [generates a random position for food and draws it to the gameboard]
// Params: string foodType [one of cells determined in gameboard class]
// Return: void

GameBoard.prototype.addFood = function(foodType){

	var badLocation=true;

	while (badLocation) {

		this.foodPosX = Math.floor(Math.random()*global.width);  
		this.foodPosY = Math.floor(Math.random()*global.height);
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

GameBoard.prototype.setScore = function(score) { 

	
	document.getElementById('score').innerHTML= "Score: "+score;
}


// * Public method getPositionInfo(params) [provides info what exist in that position in the game board]
// Params: int posX, int posY
// Return: object [info what is in that position on gameboard]

GameBoard.prototype.getPositionInfo = function(posX,posY) {

	position = posX+'_'+posY;
	var posInfo = '';
	

//TODO

/*	

	//checking if the worm is going against the wall
	//some problems as it doesn't registrate the last row in it's position, but the one before it
	if(that.vectY<0 && posY==1)
	{
		//console.log("kuolee");  // do not determine gameover here, but in game class
		posInfo = 'outside';
	}
	if(that.vectY>0 && posY==18)
	{
		//console.log("kuolee");  // do not determine gameover here, but in game class
		posInfo = 'outside';
	}
	if(that.vectX<0 && posX==1)
	{
		//console.log("kuolee");  // do not determine gameover here, but in game class
		posInfo = 'outside';
	}
	if(that.vectX>0 && posX==18)
	{
		//console.log("kuolee");  // do not determine gameover here, but in game class
		posInfo = 'outside';
	}
*/

	return {
		'position': position, 'value': posInfo
	};

// return values: worm / empty / outside / food ?

}