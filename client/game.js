var snakePosition = [];

function startGame(width, height) {
	
	this.height = height;
	this.width = width;

	console.log("startGame function called");
	
	initGameboard(width, height);
	
	drawWorm({
		'length': 5,
		'color': 'blue',
		'startPosX': width/2,
		'startPosY': height/2
	});
	//newFood();
}

function initGameboard(width, height) {
	console.log("initGameboard");

	var gameboard = '<div id="gameboard">';
	for(var i=0;i<height;i++) {
		gameboard+='<div class="row">';
		for(var j=0;j<width;j++) {
			var id=j+'_'+i;
			var grid = '<div id="' + id + '"title="' + id + '" class="cell"></div>';
			gameboard+=grid;
		}
		gameboard += '</div>';
	}
	gameboard+='</div>';
	document.getElementById('gameboard').innerHTML = gameboard;
}


// Draws the initial worm
// Array of params: int length, string color, int startPosX, int startPosY

function drawWorm(myWorm) {

	for(var i=0;i<myWorm.length;i++) {
	snakePosition.push(myWorm.startPosX+'_'+(myWorm.startPosY+i));
	document.getElementById(myWorm.startPosX+'_'+(myWorm.startPosY+i)).style.backgroundColor = myWorm.color;
	}	
}


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
