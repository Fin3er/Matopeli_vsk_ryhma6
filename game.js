var snakePosition = [];

function startGame() {
	console.log("startGame function called");
	initGameboard(20,20);
	drawWorm();
	newFood();
}

function initGameboard(height,width) {
	console.log("initGameboard");

	var gameboard = '<table id="gameboard">';
	for(var i=0;i<height;i++) {
		gameboard+='<tr>';
		for(var j=0;j<width;j++) {
			var id=(j+(i*height));
			var grid = '<td id="' + id + '"title="' + id + '"></td>';
			gameboard+=grid;
		}
		gameboard += '</tr>';
	}
	gameboard+='</table>';
	document.getElementById('gameboard').innerHTML = gameboard;
}

function drawWorm() {
	var length=5;
	var color='blue';
	var startPosition = 62;

for(var i=0;i<length;i++){
	snakePosition.push(startPosition+i);
	document.getElementById(startPosition+i).style.backgroundColor = color;
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