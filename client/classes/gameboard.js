
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


// * Public method drawToBoard(params) [draws "anything" to the cells of the game] *
// Params: array coords [{pos, cellType}]
// Returns: void

GameBoard.prototype.drawToBoard = function(coords) {

	coords.data.forEach(function(coord) {
		document.getElementById(coord.pos).className = global.gameboard.getCellTypes()[coord.cellType];
	});
	
}