(function ($) {

	// data definition
	var pingpong={
		paddleA:{
			x: 50,
			y: 100,
			width: 20,
			height:70
		},
		paddleB:{
			x: 320,
			y: 100,
			width: 20,
			height:70	
		},
		playground:{
			offsetTop: $("#playground").offset().top,
			height: parseInt($("#playground").height()),
			width: parseInt($("#playground").width()),
		},
		ball:{
			speed:5,
			x:150,
			y:100,
			radius:20,
			directionX:1,
			directionY:1
		},
		scoreA:0,
		scoreB:0
	};

	// ball collection logic
	// 判断下一帧是否超出边界
	function ballHitsTopBottom () {
		var y=pingpong.ball.y+pingpong.ball.speed*pingpong.ball.directionY;
		return y<0||y>pingpong.playground.height;
	}
	function ballHitsRightWall () {
		return pingpong.ball.x+pingpong.ball.speed*pingpong.ball.directionX>pingpong.playground.width;
	}
	function ballHitsLeftWall () {
		return pingpong.ball.x+pingpong.ball.speed*pingpong.ball.directionX<0;
	}

	// ball movement logic
	function moveball () {
		// 获取引用
		var ball=pingpong.ball;

		if(ballHitsTopBottom()){
			ball.directionY*=-1;
		}

		if(ballHitsRightWall()){
			playerAWin();
		}
		if(ballHitsLeftWall()){
			playerBWin();
		}

		
		// Variables for checking paddles
		var ballX=ball.x+ball.speed*ball.directionX;
		var ballY=ball.y+ball.speed*ball.directionY;

		// check moving paddle here,later
		// check left paddle
		if(ballX>=pingpong.paddleA.x && ballX<pingpong.paddleA.x+pingpong.paddleA.width){
			if(ballY>=pingpong.paddleA.y && ballY<=pingpong.paddleA.y+pingpong.paddleA.height){
				ball.directionX=1;
			}
		}

		// check right paddle
		if(ballX+pingpong.ball.radius>=pingpong.paddleB.x && ballX<pingpong.paddleB.x+pingpong.paddleB.width){
			if(ballY+pingpong.ball.radius>=pingpong.paddleB.y && ballY<=pingpong.paddleB.y+pingpong.paddleB.height){
				ball.directionX=-1;
			}
		}

		// 更新ball的位置数据
		ball.x+=ball.speed*ball.directionX;
		ball.y+=ball.speed*ball.directionY;
	}

	// winning logic
	function playerAWin () {
		pingpong.ball.x=250;
		pingpong.ball.y=100;

		pingpong.ball.directionX=-1;

		 // add score
    	pingpong.scoreA+=1;
    	$("#score-a").text(pingpong.scoreA);
	}
	function playerBWin () {
		pingpong.ball.x=150;
		pingpong.ball.y=100;		

		pingpong.ball.directionX=1;

		   // add score
    	pingpong.scoreB+=1;
    	$("#score-b").text(pingpong.scoreB);
	}

	// 自动控制左边选手的位置数据
	function autoMovePaddleA () {
		var speed=4;
		var direction=1;

		var paddleY=pingpong.paddleA.y+pingpong.paddleA.height/2;
		if(paddleY>pingpong.ball.y){
			direction=-1;
		}
		pingpong.paddleA.y+=speed*direction;
	}

	// view rendering
	function renderPaddles () {
		$("#paddleB").css("top",pingpong.paddleB.y);
		$("#paddleA").css("top",pingpong.paddleA.y);
	}
	function renderBall (argument) {
		var ball=pingpong.ball;
		$("#ball").css({
			"left":ball.x+ball.speed*ball.directionX,
			"top":ball.y+ball.speed*ball.directionY 
		});
	}

	function handleMouseInputs () {
		// run the game when mouse moves in the playground.
		$("#playground").mouseenter(function () {
			pingpong.isPaused=false;
		});

		// pause the game when mouse moves out the playground.
		$("#playground").mouseenter(function () {
			pingpong.isPaused=true;
		});

		// calculate the paddle position by using the mouse position
		$("#playground").mousemove(function (e) {
			console.log("mousemove (%f,%f)",e.pageY,pingpong.playground.offsetTop);

			pingpong.paddleB.y=e.pageY-pingpong.playground.offsetTop;
		});
	}

	// browser render
	function render () {
		renderBall();
		renderPaddles();

		window.requestAnimationFrame(render);
	}



	function gameloop () {
		moveball();
		autoMovePaddleA();
	}
	
	// starting point of entire game
	function init () {
		console.log("init");

		// set interval to call gameloop logic in 30 FPS
    	pingpong.timer = setInterval(gameloop, 1000/30);

		// view rendering
		window.requestAnimationFrame(render);

		// inputs
		handleMouseInputs();
	}

	//  Execute the starting point
	init();

})(jQuery);