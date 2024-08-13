//CODED BY KENNY SCOFIELD
			//VERSION: 1.0.3 - BETA
			const Puncs = ['.', '?', '!','?!'];
			
			var IComma = new Image();
			IComma.src =  './COMMA_SPRITE_SHEET_REVISED.png';
			IComma.crossOrigin = "anonymous";
			var IPeriod = new Image();
			IPeriod.src =  './PERIOD_SPRITE_SHEET.png';
			IPeriod.crossOrigin = "anonymous";
			var IQuestion = new Image();
			IQuestion.src =  './QUEST_SPRITE_SHEET.png';
			IQuestion.crossOrigin = "anonymous";
			var IExclaim = new Image();
			IExclaim.src =  './EXCLAIM_SPRITE_SHEET.png';
			IExclaim.crossOrigin = "anonymous";
			var IInterro = new Image();
			IInterro.src =  './INTERRO_SPRITE_SHEET.png';
			IInterro.crossOrigin = "anonymous";
			console.log("test");
			
			const TimeBonus = 2;
			const playarea = document.getElementById("playarea");
			playarea.addEventListener("mousemove", updatePos, false);
			var timer = 30, minutes, seconds;
			var TodayRandom = [];
			var RandOffset= 0;
			var elem=[];
			var score = 0;
			var scaler = 1;
			var maxPuncs = getPunctuationAmount();
			var ScoreBar = 1000;
			var commaTime = getCommaTime(0, 0);
			var commaHit = 0;
			var posX;
			var posY;
			const SPRITE_SIZE = 96;
			let firstClickTime = null;
        	let clickSpeed = null;
			var canvas = document.createElement('canvas');
			canvas.width = SPRITE_SIZE;  // Set canvas width and height
			canvas.height = SPRITE_SIZE;
			var ctx = canvas.getContext('2d');
			IComma.onload = function() {
				ctx.drawImage(IComma, 0, 0, SPRITE_SIZE,SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
				playarea.appendChild(canvas);
				console.log("loaded comma");
			};
			IComma.onerror = function() {
				console.error("Failed to load image.");
			};
			function spritePositionToImagePosition(col) {
				return {
					x: (col * (SPRITE_SIZE))
				};
			}
			
			function AnimatePop(PuncImage, i) {
				var col = 0;
				const Interval =setInterval(() => {
					if (col === 3) {
						clearInterval(Interval);
						return;
					}
					var position = spritePositionToImagePosition(col);
					elem[i].getContext('2d').clearRect(0,0,elem[i].width,elem[i].height);
					elem[i].getContext('2d').drawImage(PuncImage,position.x,0,SPRITE_SIZE,SPRITE_SIZE,0,0,SPRITE_SIZE,SPRITE_SIZE);
					col += 1;
				}, 300);
			}
			
			

			function getPunctuationAmount(){
				if(isMobile()){
					return 15;
				}
				else{
					return 45;
				}
			};
			function isMobile() {
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			}
			function getRandomNumber(min, max) {  //RANDOM NUM
				
				if(TodayRandom.length==0){
					for(let i = 0; i < 500; i++){
						TodayRandom.push(Math.random());
					}
					//console.log(TodayRandom);
				}
				RandOffset = RandOffset + 1;
				
				//console.log(RandOffset);
				return Math.floor(TodayRandom[RandOffset % TodayRandom.length] * (max - min)+min);
			}
			document.body.addEventListener("click", function (){  //WAIT FOR CLICK TO START GAME
				startTimer(document.getElementById("Timer"));
				this.removeEventListener("click",arguments.callee,false);
				document.getElementById("Timer").classList.add("started");
				document.getElementById("score").classList.add("started");
				document.getElementById("key").classList.add("started");
				StartGame();
			}); //Start Timer
			
			function getCommaTime(offsetX, offsetY){
				let a = getRandomNumber(timer-20-offsetX,timer-10+offsetX);
				let b = getRandomNumber(timer-18-offsetY,timer-8+offsetY);
				while (a >= b-TimeBonus && a <= b+TimeBonus){
					b = getRandomNumber(timer-18-offsetY,timer-8+offsetY);
				} 
				console.log(a + ", " + b);
				return [a,b];
			}
			function clampNumber(num, a, b){ //clamp(n, min, max)
				return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
			} 
			
			function Norm(){
				const min = parseInt((11).toString() );
				const max = parseInt((1231).toString() );
				const Today = parseInt((new Date().getMonth()+1).toString() + new Date().getDate().toString());
				const Rand = (84 - min) / (max - min);
				return Rand;
				
			}
			
			function updatePos(event){
				posX = event.pageX;
				posY = event.pageY;
				
			}
			document.body.addEventListener("click", function(event){  //handles clicking of punctuations
				if (firstClickTime === null) {
					// First click
					firstClickTime = Date.now();
				} else {
					// Second click
					const secondClickTime = Date.now();
					clickSpeed = (secondClickTime - firstClickTime)/1000;
					firstClickTime = null; // Reset for next click sequence
				}
				if(clickSpeed>18){
					console.log("clicked too fast" + clickSpeed);
					return;
				}
				const clickedElement =event.target;
				const index = elem.indexOf(clickedElement);
					if(index !== -1){
						
						AnimatePop(elem[index].getContext('2d').getImageData(0,0,96,96), index);
						UpdateScoreBoard(index);
					}
			});
			
			async function Movebutton(e){ //UPDATE BUTTON LOCATION
				var winWidth;
				var winHeight;
				var randomTop;
				var randomLeft;
				var fontS;
				var movementClock;
				var ctx = elem[e].getContext('2d');
				
				//console.log(e);
				var i = getRandomNumber(0,100); //weighted random
				switch (true){
					case (i<40): //period
						elem[e].classList.add("period");
						fontS = getRandomNumber(12,24);
						i=0;
						break;
					case (i<70): //question
						elem[e].classList.add("question");
						fontS = getRandomNumber(12,22);
						i=1;
						break;
					case (i<90): //exclamation
						elem[e].classList.add("exclamation");
						fontS = getRandomNumber(12,20);
						i=2;
						break;
					case (i<100): //interrobang
						elem[e].classList.add("interro");
						fontS = getRandomNumber(12,18);
						i=3;
						break;
				}
				elem[e].style.fontSize = fontS + "vh";
				elem[e].innerHTML = Puncs[i];
				
				setTimeout(function(){
					elem[e].id = "enabled";
					
					winWidth = playarea.offsetWidth - elem[e].offsetWidth;
					winHeight = playarea.offsetHeight - elem[e].offsetHeight;
					randomTop = getRandomNumber(0, winHeight);
					randomLeft = getRandomNumber(0, winWidth);
					elem[e].style.top = randomTop + "px";
					elem[e].style.left = randomLeft + "px";
					
					
				},1000);
				movementClock = setInterval(function(){
						let rectX = Math.floor(elem[e].getBoundingClientRect().left + ((elem[e].getBoundingClientRect().right - elem[e].getBoundingClientRect().left)/2));
						let rectY = Math.floor(elem[e].getBoundingClientRect().top) + ((elem[e].getBoundingClientRect().bottom - elem[e].getBoundingClientRect().top)/2);
						let borderDist = 200;
						if (timer>-1){
							randomTop = clampNumber(parseInt(elem[e].style.top) + getRandomNumber(-30, 30),0 , playarea.offsetHeight - elem[e].offsetHeight);
							randomLeft = clampNumber(parseInt(elem[e].style.left) + getRandomNumber(-30, 30), 0 ,playarea.offsetWidth - elem[e].offsetWidth);
							/*if(!isMobile() && ((posY > rectY - borderDist  && rectY + borderDist > posY) && (posX > rectX - borderDist && rectX +borderDist > posX))){
								randomTop = parseInt(randomTop) + ((posY - rectY)/2.5);
								randomLeft = parseInt(randomLeft) + ((posX - rectX)/2.5);
								//console.log(posY - rectY);
							}  */
 							elem[e].style.top = randomTop + "px";
							elem[e].style.left = randomLeft + "px";
						}
						else {
							clearInterval(movementClock);
						}
						
					},500);
				}
				
				
			async function UpdateScoreBoard(button){ //punctuation clicked - update SCOREBOARD - spawn new punctuation
				if(timer<-1){
					return;
				}
				window?.navigator?.vibrate?.(1);
				
				clearInterval(elem[button].movementClock);
				switch (elem[button].innerHTML){
					case ".": //period
						score = score + 10*scaler;
						elem[button].classList.remove("period");
						
						break;
					case "?": //question
						score = score + 25*scaler;
						elem[button].classList.remove("question");
						
						break;
					case "!": //exclamation
						score = score + 50*scaler;
						elem[button].classList.remove("exclamation");
						
						break;
					case "?!": //interrobang
						score = score + 100*scaler;
						elem[button].classList.remove("interro");
						
						break;
				}
				if(score>ScoreBar){
						timer=timer+TimeBonus;
						ScoreBar = ScoreBar+1000;
						
						if ((commaTime[0] >timer && commaTime[1] >timer) || commaHit >2){
							commaTime = getCommaTime(5, 2);
							commaHit = 0;
							//console.log("reset commas at "+score);
						}
						
					}
				elem[button].id = "disabled";
				elem[button].innerHTML = " ";
				
				document.getElementById("score").innerHTML = "Score: ".bold() + score;
				Movebutton(button);
			}
			
			function startTimer(display) {  //TIMER
				
				var mytimer = setInterval(function () {
					//console.log(commaTime+" - "+timer);
					
					minutes = parseInt(timer / 60, 10);
					seconds = parseInt(timer % 60, 10);
					
					minutes = minutes < 10 ? "0" + minutes : minutes;
					seconds = seconds < 10 ? "0" + seconds : seconds;

					display.innerHTML = "Time Left: ".bold() + minutes + ":" + seconds;
					
					if (timer == commaTime[0] || timer == commaTime[1]){
						spawnComma();
					}
					if (--timer < -1) {
						Endgame();
						clearInterval(mytimer);
						display.innerHTML = "<b>Time Left: </b> 00:00";
					}
				}, 1000);
			}
			function spawnComma(){  //COMMA MULTIPLYER
				console.log("comma spawned");
				var comma = document.createElement("span")
				//document.body.appendChild(comma);
				document.getElementById("playarea").appendChild(comma);
				comma.classList.add("button");
				comma.style.color = "red";
				comma.style.padding = "0px 50px 30px 50px";
				comma.innerHTML = ","
				comma.id = "enabled";
				winWidth = playarea.offsetWidth - comma.offsetWidth;
				winHeight = playarea.offsetHeight - comma.offsetHeight;
				randomTop = getRandomNumber(0, winHeight);
				randomLeft = getRandomNumber(0, winWidth);
				comma.style.top = randomTop + "px";
				comma.style.left = randomLeft + "px";
				comma.style.zIndex = 2;
				comma.addEventListener("click", function(){
					this.remove();
					scaler = clampNumber(scaler*2,1,4);
					commaHit = commaHit++;
					var shadowdist = function(a){ return "0px 0px "+((a)**2)+ "px red";};
					
					for(let i=0;i<maxPuncs;i++){
						elem[i].style.textShadow = shadowdist(scaler);
					}
					
					setTimeout(function () {
						scaler = clampNumber(scaler/2,1,4);
						for(let i=0;i<maxPuncs;i++){
							elem[i].style.textShadow = shadowdist(scaler);
						}
					},5000);
				});
			}
			
			function Endgame(){  //END GAME
				alert("Game Over! Your score is: "+score +"\n Refresh page to play again!");
				
			}
			function StartGame(){
				
				for(let butcount=0;butcount<maxPuncs;butcount++){ //load punctuations, begin game
					var winWidth;
					var winHeight;
					var randomTop;
					var randomLeft;
					elem.push(document.createElement('canvas'));
					elem[butcount].width = SPRITE_SIZE;  // Set canvas width and height
					elem[butcount].height = SPRITE_SIZE;
					var ctx = elem[butcount].getContext('2d');
					
					
					elem[butcount].classList.add("button");
					
					var i = getRandomNumber(0,4);
					switch (i){
						case 0:
							//elem[butcount].classList.add("period");
							IPeriod.onload = function() {
								ctx.drawImage(IPeriod,0,0,SPRITE_SIZE,SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
							}
							IPeriod.onerror = function() {
								console.error("Failed to load image.");
							};
							break;
						case 1:
							//elem[butcount].classList.add("question");
							IQuestion.onload = function() {
								ctx.drawImage(IQuestion,0,0,SPRITE_SIZE,SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
							}
							IQuestion.onerror = function() {
								console.error("Failed to load image.");
							};
							break;
						case 2:
							//elem[butcount].classList.add("exclamation");
							IExclaim.onload = function() {
								ctx.drawImage(IExclaim,0,0,SPRITE_SIZE,SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
							}
							IExclaim.onerror = function() {
								console.error("Failed to load image.");
							};
							break;
						case 3:
							//elem[butcount].classList.add("interro");
							IInterro.onerror = function() {
								console.error("Failed to load image.");
							};
							IInterro.onload = function() {
								ctx.drawImage(IInterro,0,0,SPRITE_SIZE,SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
							}
							break;
					}
					document.getElementById("playarea").appendChild(elem[butcount]);
					//elem[butcount].innerHTML = Puncs[i];
					elem[butcount].id = "enabled";
					winWidth = playarea.offsetWidth -  SPRITE_SIZE;
					winHeight = playarea.offsetHeight -  SPRITE_SIZE;
					randomTop = getRandomNumber(0, winHeight);
					randomLeft = getRandomNumber(0, winWidth);
					elem[butcount].style.top = randomTop + "px";
					elem[butcount].style.left = randomLeft + "px";
					
					
				}
				
			}