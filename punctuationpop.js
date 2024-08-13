//CODED BY KENNY SCOFIELD
			//VERSION: 1.1.0 - BETA
			const Puncs = ['.', '?', '!','?!'];
			
			const PImages = {
				period: new Image(),
				question: new Image(),
				exclaim: new Image(),
				interro: new Image(),
				comma: new Image()
			};
			
			PImages.period.src = './PERIOD_SPRITE_SHEET.png';
			PImages.question.src = './QUEST_SPRITE_SHEET.png';
			PImages.exclaim.src = './EXCLAIM_SPRITE_SHEET.png';
			PImages.interro.src = './INTERRO_SPRITE_SHEET.png';
			PImages.comma.src = './COMMA_SPRITE_SHEET_REVISED.png';
			
			const imagePromises = Object.values(PImages).map(img => new Promise((resolve, reject) => {
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
			}));
			
			Promise.all(imagePromises).then(() => {
				// All images are loaded, now you can proceed with your canvas setup
				document.body.addEventListener("click", function (){  //WAIT FOR CLICK TO START GAME
					startTimer(document.getElementById("Timer"));
					this.removeEventListener("click",arguments.callee,false);
					document.getElementById("Timer").classList.add("started");
					document.getElementById("score").classList.add("started");
					document.getElementById("key").classList.add("started");
					StartGame();
				}); //Start Timer
			}).catch(error => {
				console.error(error);
			});
			
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
			/*var canvas = document.createElement('canvas');
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
			};*/
			function spritePositionToImagePosition(col) {
				return {
					x: (col * (SPRITE_SIZE))
				};
			}
			
			function AnimatePop(canvas) {
				var col = 1;
				const ctx = canvas.getContext('2d');
				//console.log(canvas + " + " + canvas.classList);
				let imageKey = null;
				switch (true){
					case (canvas.classList.contains("period")): 
						imageKey = PImages.period;
					break;
					case (canvas.classList.contains("question")): 
						imageKey = PImages.question;
					break;
					case (canvas.classList.contains("exclamation")): 
						imageKey = PImages.exclaim;
					break;
					case (canvas.classList.contains("interro")): 
						imageKey = PImages.interro;
					break;
					case (canvas.classList.contains("comma")): 
						imageKey = PImages.comma;
					break;
				}
				if (!imageKey) {
					console.error('No image found for the specified class.');
					return;
				}
				UpdateScoreBoard(canvas);
				const Interval =setInterval(() => {
					if (col === 3) {
						ctx.clearRect(0,0,canvas.width,canvas.height);
						
						if(canvas.classList.contains("comma")){
							canvas.remove;
						} else {
							canvas.id = "disabled";
							clearInterval(Interval);
							Movebutton(elem.indexOf(canvas));
						}
						return;
					}
					var position = spritePositionToImagePosition(col);
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.drawImage(imageKey,position.x,0,SPRITE_SIZE,SPRITE_SIZE,0,0,SPRITE_SIZE,SPRITE_SIZE);
					
					col += 1;
				}, 100);
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
						//console.log(clickedElement);
						AnimatePop(clickedElement) ;
						
					}
			});
			
			async function Movebutton(e){ //UPDATE BUTTON LOCATION
				//var fontS;
				let selectedImage;
				var ctx = elem[e].getContext('2d');
				
				//console.log(e);
				var i = getRandomNumber(0,100); //weighted random
				switch (true){
					case (i<40): //period
						elem[e].classList.add("period");
						//fontS = getRandomNumber(12,24);
						selectedImage = PImages.period;
						break;
					case (i<70): //question
						elem[e].classList.add("question");
						//fontS = getRandomNumber(12,22);
						selectedImage = PImages.question;
						break;
					case (i<90): //exclamation
						elem[e].classList.add("exclamation");
						//fontS = getRandomNumber(12,20);
						selectedImage = PImages.exclaim;
						break;
					case (i<100): //interrobang
						elem[e].classList.add("interro");
						//fontS = getRandomNumber(12,18);
						selectedImage = PImages.interro;
						break;
				}
				//elem[e].style.fontSize = fontS + "vh";
				//elem[e].innerHTML = Puncs[i];
				
				ctx.drawImage(selectedImage, 0, 0, SPRITE_SIZE, SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
				setTimeout(function(){
					elem[e].id = "enabled";
					
					let winWidth = playarea.offsetWidth - elem[e].offsetWidth;
					let winHeight = playarea.offsetHeight - elem[e].offsetHeight;
					let randomTop = getRandomNumber(0, winHeight);
					let randomLeft = getRandomNumber(0, winWidth);
					elem[e].style.top = randomTop + "px";
					elem[e].style.left = randomLeft + "px";
					
					
				},1000);
				let movementClock = setInterval(function(){
						//let rectX = Math.floor(elem[e].getBoundingClientRect().left + ((elem[e].getBoundingClientRect().right - elem[e].getBoundingClientRect().left)/2));
						//let rectY = Math.floor(elem[e].getBoundingClientRect().top) + ((elem[e].getBoundingClientRect().bottom - elem[e].getBoundingClientRect().top)/2);
						//let borderDist = 200;
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
				
				
			async function UpdateScoreBoard(punc){ //punctuation clicked - update SCOREBOARD - spawn new punctuation
				if(timer<-1){
					return;
				}
				window?.navigator?.vibrate?.(1);
				
				clearInterval(punc.movementClock);
				switch (true) {
					case punc.classList.contains("period"): //period
						score = score + 10*scaler;
						punc.classList.remove("period");
						
						break;
					case punc.classList.contains("question"):
						score = score + 25*scaler;
						punc.classList.remove("question");
						
						break;
					case punc.classList.contains("exclamation"):
						score = score + 50*scaler;
						punc.classList.remove("exclamation");
						
						break;
					case punc.classList.contains("interro"):
						score = score + 100*scaler;
						punc.classList.remove("interro");
						
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
				punc.id = "clicked";
				//elem[button].innerHTML = " ";
				
				document.getElementById("score").innerHTML = "Score: ".bold() + score;
				
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
				let comma = document.createElement('canvas');
				comma.width = SPRITE_SIZE;
				comma.height = SPRITE_SIZE;
				let ctx = comma.getContext('2d');
		
				let i = getRandomNumber(0, 4);
				let selectedImage = PImages.comma;
				ctx.drawImage(selectedImage, 0, 0, SPRITE_SIZE, SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
				document.getElementById("playarea").appendChild(comma);
				comma.classList.add("button");
				comma.classList.add("comma");
				comma.id = "enabled";
				winWidth = playarea.offsetWidth - comma.offsetWidth;
				winHeight = playarea.offsetHeight - comma.offsetHeight;
				randomTop = getRandomNumber(0, winHeight);
				randomLeft = getRandomNumber(0, winWidth);
				comma.style.top = randomTop + "px";
				comma.style.left = randomLeft + "px";
				comma.style.zIndex = 2;
				comma.addEventListener("click", function(){
					AnimatePop(comma);
					scaler = clampNumber(scaler*2,1,4);
					commaHit = commaHit++;
					var shadowdist = function(a){ return "0px 0px "+((a)**2)+ "px red";};
					
					for(let i=0;i<maxPuncs;i++){
						elem[i].style.setProperty("-webkit-filter", "drop-shadow("+ shadowdist(scaler) + ")");
					}
					
					setTimeout(function () {
						scaler = clampNumber(scaler/2,1,4);
						for(let i=0;i<maxPuncs;i++){
							elem[i].style.setProperty("-webkit-filter", "drop-shadow("+ shadowdist(scaler) + ")");
						}
					},5000);
				});
			}
			
			function Endgame(){  //END GAME
				alert("Game Over! Your score is: "+score +"\n Refresh page to play again!");
				
			}
			function StartGame(){
				
				
					for(let butcount = 0; butcount < maxPuncs; butcount++) {
						elem.push(document.createElement('canvas'));
						elem[butcount].width = SPRITE_SIZE;
						elem[butcount].height = SPRITE_SIZE;
						let ctx = elem[butcount].getContext('2d');
						let i = getRandomNumber(0, 4);
						let selectedImage;
				
						switch (i){
							case 0: //period
								elem[butcount].classList.add("period");
								//fontS = getRandomNumber(12,24);
								selectedImage = PImages.period;
								break;
							case 1: //question
								elem[butcount].classList.add("question");
								//fontS = getRandomNumber(12,22);
								selectedImage = PImages.question;
								break;
							case 2: //exclamation
								elem[butcount].classList.add("exclamation");
								//fontS = getRandomNumber(12,20);
								selectedImage = PImages.exclaim;
								break;
							case 3: //interrobang
								elem[butcount].classList.add("interro");
								//fontS = getRandomNumber(12,18);
								selectedImage = PImages.interro;
								break;
						}
				
						ctx.drawImage(selectedImage, 0, 0, SPRITE_SIZE, SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
				
						document.getElementById("playarea").appendChild(elem[butcount]);
				
						elem[butcount].classList.add("button");
						elem[butcount].id = "enabled";
				
						let winWidth = playarea.offsetWidth - SPRITE_SIZE;
						let winHeight = playarea.offsetHeight - SPRITE_SIZE;
						let randomTop = getRandomNumber(0, winHeight);
						let randomLeft = getRandomNumber(0, winWidth);
				
						elem[butcount].style.top = randomTop + "px";
						elem[butcount].style.left = randomLeft + "px";
					}
				
			}