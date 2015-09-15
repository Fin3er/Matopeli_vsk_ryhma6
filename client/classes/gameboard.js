
/* ==================================================================== */

// ----- Class: GameBoard -----
// Contains: creating and modifying the gameboard and game interface

/* ==================================================================== */

// Constructor - generates the game board
// Params: width, height game board
// Returns: nothing


function GameBoard(width, height) {

	this.hasFood = false;

	this.cellClasses = {
		'empty': 'empty_cell',
		'basicfood': 'food_cell',
		'superfood': 'superfood_cell',
		'worm_1': 'worm_1_cell',
		'worm_2': 'worm_2_cell',
		'worm_3': 'worm_3_cell',
		'worm_4': 'worm_4_cell'
	}

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

	gameboard+='</div>';

	document.getElementById('gameboard').innerHTML = gameboard;
}


// Method: drawToBoard - draws "anything" to the cell of the game
// Params: pos (position; id of div)
// Returns: nothing

GameBoard.prototype.drawToBoard = function(pos, cellType) { 
	
	// must use scope here, as this is a public method of this class
	document.getElementById(pos).className = scope.gameBoard.cellClasses[cellType];
}


// Method: addFood - generates a random position for food and draws it to the gameboard
// Params: foodType
// Return: nothing

GameBoard.prototype.addFood = function(foodType){

	var badLocation=true;

	while (badLocation) {

		var foodPosX = Math.floor(Math.random()*global.width);
		var foodPosY = Math.floor(Math.random()*global.height);
		var foodPosition = foodPosX+'_'+foodPosY;

		for(var i=0; i<scope.worm.position.length; i++){

			if (scope.worm.position[i] == foodPosition){
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


// Method: setScore - sets score of the game
// Params: int score
// Returns: nothing

GameBoard.prototype.setScore = function(score) { 
	
	document.getElementById('score').innerHTML= "Score: "+score;
}


// Method: getPositionInfo - provides info what exist in that position in the game board
// Params: position (x_y)
// Return: info what is in that position on gameboard

GameBoard.prototype.getPositionInfo = function(position){

	var posInfo = '';

//TODO

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


	return posInfo;

// return: worm / empty / outside / food ?

}