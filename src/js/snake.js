$(document).ready(function() {

	// game settings: 
	var snakeInitialSize = 3;
	var snakeInitialSpeed = 300;
	// get game area canvas
	var area = $("#area")[0].getContext("2d");
	var areaWidth = $("#area").width();
	var areaHeight = $("#area").height();
	// get info area  canvas
	var info = $("#info")[0].getContext("2d");
	var infoWidth = $("#info").width();
	var infoHeight = $("#info").height();
	// other global variables
	var interval = null;
	var gameStart = false;
	var snakeBody = null;
	var direction = 'right';
	var food = null;
	var points = 0;
	var level = 1;

	var Init = function() {
		// create snake at the top left corner of game area
		CreateSnake();
		interval = setInterval(Snake,snakeInitialSpeed);
	};

	var Snake = function() {
		CreateGameArea();
		CreateInfoArea(points,level);
		if(gameStart) 
		{
			CreateFood();
			PaintFood();
			// get current snake head positions 
			var headX = snakeBody[0].x;
			var headY = snakeBody[0].y;
			// change snake head position (depends on direction)
			switch(direction)
			{
				case 'right':
					headX++;
					break;
				case 'left':
					headX--;
					break;
				case 'up':
					headY--;
					break;
				case 'down':
					headY++;
					break;					
			}
			// check if new head position has some collisons
			if(CheckCollision(headX,headY,snakeBody))
			{
				var eatenFood = CheckIfSankeEatFood(headX,headY);
				var snakeHead = null;
				if(eatenFood != null)
				{
					points += 1;
					if(points == level*10)
						level++;
					snakeHead = {'x': headX, 'y': headY };
					DeleteFoodFromArray(headX,headY);
				}
				else
				{
					snakeHead = snakeBody.pop();
					snakeHead = {'x': headX, 'y': headY };
				}
				// join new head with the rest of the snake body
				snakeBody.unshift(snakeHead);
				PaintSnake(snakeBody);
			}
		}
	};

	var PaintSnake = function () {
		var size = 16; // snake item size
		for(var i = 0; i < snakeBody.length; i++)
		{
			var x = snakeBody[i].x;
			var y = snakeBody[i].y;
			// item 0 is snake head
			if(i == 0)
			{
				var img = new Image();
				img.src = '../public/img/head.png';
				area.fillStyle = area.createPattern(img, "repeat");
				area.fillRect(x*size, y*size, size, size);
			}
			// rest of snake body
			else
			{
				var img = new Image();
				img.src = '../public/img/body.png';
				area.fillStyle = area.createPattern(img, "repeat");
				area.fillRect(x*size, y*size, size, size);
			}
		}
	};

	var CheckIfSankeEatFood = function(x,y) {
		if(food.x == x && food.y == y)
			return food;
		return null;
	};	

	var DeleteFoodFromArray = function(x,y) {
		if(food.x == x && food.y == y)
				food = null;
	};

	var CheckCollision = function (x,y, currentSnakeBody) {
		var gameOver = false;
		// check collision with the wall	
		if(x < 0 || x >= areaWidth/16 || y < 0 || y >= areaHeight/16)
			gameOver = true;
		// check collision with the snake body
		for(var i = 0; i < currentSnakeBody.length; i++)
			if(x == currentSnakeBody[i].x && y == currentSnakeBody[i].y)
				gameOver = true;

		if(!gameOver)
			return true;
		else
		{
			alert('Game Over :-(');
			gameStart = false;
			ResetGame();
			return false;
		}
	};

	var ResetGame = function() {
		points = 0;
		level = 1;
		food = null;
		direction = 'right';
		CreateSnake();
		$("#startend").html('Start');
	};	

	var CreateFood = function()
	{
		if(food == null)
		{
			var position = GetRandomPositions();
			food = {'x': position.x, 'y': position.y};
		}
	};

	var PaintFood = function()
	{
		var img = new Image();
		img.src = '../public/img/limon.png';
		area.fillStyle = area.createPattern(img, "repeat");
		area.fillRect(food.x*16, food.y*16, 16, 16);	
	};

	var CreateSnake = function () {
		snakeBody = [];
		for(var i = snakeInitialSize - 1; i >= 0; i--)
			snakeBody.push({'x':i,'y':0});
	};

	var CreateGameArea = function () {
		area.fillStyle = "#000";
		area.fillRect(0,0,areaWidth,areaHeight);
	};

	var CreateInfoArea = function (points,level) {
		info.fillStyle = "white";
		info.fillRect(0, 0, infoWidth, infoHeight);
		info.fillStyle = "blue";
		info.font = '16px verdana';
		info.fillText('Points:', 15, 25);
		info.fillText('Level:', 15, 80);
		info.fillStyle = "black";
		info.font = '18px verdana';
		info.fillText(points, 15, 52);
		info.fillText(level, 15, 110);
	};

	var GetRandomPositions = function() {
		var correct = false;
		var position = {'x':null, 'y': null };
		var randomX = Math.round(Math.random()*(areaWidth-16)/16);
		var randomY = Math.round(Math.random()*(areaHeight-16)/16);
		for(var i = 0; i < snakeBody.length; i++)
		{
			if(randomX == snakeBody[i].x && randomX == snakeBody[i].y)
			{
				break;
				GetRandomPositions();
			}
		}
		position.x = randomX;
		position.y = randomY;
		return position;
	};

	Init();

	$("#startend").click(function () {
		if(gameStart)
		{
			if(confirm('Are you sure ?'))
			{
				gameStart = false;
				ResetGame();	
			}	
		} 
		else
		{
			gameStart = true;
			$(this).html('End');		
		}

	});

	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right")  { direction = "left"; Snake(); }
		else if(key == "38" && direction != "down") { direction = "up"; Snake(); }
		else if(key == "39" && direction != "left") { direction = "right"; Snake(); }
		else if(key == "40" && direction != "up") { direction = "down"; Snake(); }
	})
});