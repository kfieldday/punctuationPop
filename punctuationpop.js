//CODED BY KENNY SCOFIELD
			//VERSION: 1.4.4 - alpha
			var timer = 30, minutes, seconds;
			const Puncs = ['.', '?', '!','?!'];
			var span=[];
			var score = 0;
			var scaler = 1;
			var winscale = .15;
			var maxPuncs = 15;
			var ScoreBar = 1000;
			var TimeBonus = 2;
			var commaTime = getCommaTime(0, 0);
			var commaHit = 0;
			var playarea = document.getElementById("playarea");
			
			document.body.addEventListener("click", function (){  //WAIT FOR CLICK TO START GAME
				startTimer(document.getElementById("Timer"));
				this.removeEventListener("click",arguments.callee,false);
				StartGame();
			}); //Start Timer
			
			function getCommaTime(offsetX, offsetY){
				let a = getRandomNumber(timer-20-offsetX,timer-10+offsetX);
				let b = getRandomNumber(timer-18-offsetY,timer-8+offsetY);
				while (a >= b-TimeBonus && a <= b+TimeBonus){
					b = getRandomNumber(timer-18-offsetY,timer-8+offsetY);
				} 
				return [a,b];
			}
			function clampNumber(num, a, b){ //clamp(n, min, max)
				return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
			} 
			function getRandomNumber(min, max) {  //RANDOM NUM
				return Math.floor(Math.random() * (max - min)+min);
			}
			
			
			async function Movebutton(e){ //UPDATE BUTTON LOCATION
				var winWidth;
				var winHeight;
				var randomTop;
				var randomLeft;
				var fontS;
				var movement;
				
				//console.log(e);
				var i = getRandomNumber(0,100);
				switch (true){
					case (i<40): //period
						span[e].classList.add("period");
						fontS = getRandomNumber(12,24);
						i=0;
						break;
					case (i<70): //question
						span[e].classList.add("question");
						fontS = getRandomNumber(12,22);
						i=1;
						break;
					case (i<90): //exclamation
						span[e].classList.add("exclamation");
						fontS = getRandomNumber(12,20);
						i=2;
						break;
					case (i<100): //interrobang
						span[e].classList.add("interro");
						fontS = getRandomNumber(12,18);
						i=3;
						break;
				}
				span[e].style.fontSize = fontS + "vh";
				span[e].innerHTML = Puncs[i];
				winWidth = playarea.offsetWidth - span[e].offsetWidth;
				winHeight = playarea.offsetHeight - span[e].offsetHeight;
				randomTop = getRandomNumber(0, winHeight);
				randomLeft = getRandomNumber(0, winWidth);
				setTimeout(function(){
					span[e].id = "enabled";
					span[e].style.top = randomTop + "px";
					span[e].style.left = randomLeft + "px";
					
					
				},1000);
				movement = setInterval(function(){
						if (timer>-1){
							randomTop = clampNumber(parseInt(span[e].style.top) + getRandomNumber(-30, 30),0 , playarea.offsetHeight - span[e].offsetHeight);
							randomLeft = clampNumber(parseInt(span[e].style.left) + getRandomNumber(-30, 30), 0 ,playarea.offsetWidth - span[e].offsetWidth);
							
							span[e].style.top = randomTop + "px";
							span[e].style.left = randomLeft + "px";
						}
						else {
						clearInterval(movement);
						}
						
					},500);
				}
				
				
			async function UpdateScoreBoard(button){ //punctuation clicked - update SCOREBOARD - spawn new punctuation
				if(timer<-1){
					return;
				}
				span[button].id = "disabled";
				clearInterval(span[button].movement);
				switch (span[button].innerHTML){
					case ".": //period
						score = score + 10*scaler;
						span[button].classList.remove("period");
						break;
					case "?": //question
						score = score + 25*scaler;
						span[button].classList.remove("question");
						break;
					case "!": //exclamation
						score = score + 50*scaler;
						span[button].classList.remove("exclamation");
						break;
					case "?!": //interrobang
						score = score + 100*scaler;
						span[button].classList.remove("interro");
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
				span[button].innerHTML = " ";
				
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
				
				comma = document.createElement("span")
				document.body.appendChild(comma);
				comma.classList.add("button");
				comma.style.color = "red";
				comma.style.padding = "0px 50px 30px 50px";
				comma.innerHTML = ","
				comma.id = "enabled";
				winWidth = window.innerWidth - comma.offsetWidth-(window.innerWidth*winscale);
				winHeight = window.innerHeight - comma.offsetHeight-(window.innerHeight*winscale);
				randomTop = getRandomNumber((window.innerHeight*winscale), winHeight);
				randomLeft = getRandomNumber((window.innerWidth*winscale), winWidth);
				comma.style.top = randomTop + "px";
				comma.style.left = randomLeft + "px";
				comma.style.zIndex = 2;
				comma.addEventListener("click", function(){
					this.remove();
					scaler = clampNumber(scaler*2,1,8);
					commaHit = commaHit++;
					var shadowdist = function(a){ return "0px 0px "+((a)**2)+ "px red";};
					
					for(let i=0;i<maxPuncs;i++){
						span[i].style.textShadow = shadowdist(scaler);
					}
					
					setTimeout(function () {
						scaler = clampNumber(scaler/2,1,8);
						for(let i=0;i<maxPuncs;i++){
							span[i].style.textShadow = shadowdist(scaler);
						}
					},5000);
				});
			}
			
			function Endgame(){  //END GAME
				alert("Game Over! Your score is: "+score +"\n Refresh page to play again!");
				
			}
			function StartGame(){
				for(let butcount=0;butcount<maxPuncs;butcount++){ //create buttons, begin game
					var winWidth;
					var winHeight;
					var randomTop;
					var randomLeft;
					span.push(document.createElement("span"));
					//document.div.appendChild(span[butcount]);
					document.getElementById("playarea").appendChild(span[butcount]);
					span[butcount].classList.add("button");
					
					var i = getRandomNumber(0,4);
					switch (i){
						case 0:
							span[butcount].classList.add("period");
							break;
						case 1:
							span[butcount].classList.add("question");
							break;
						case 2:
							span[butcount].classList.add("exclamation");
							break;
						case 3:
							span[butcount].classList.add("interro");
							break;
					}
					
					span[butcount].innerHTML = Puncs[i];
					span[butcount].id = "enabled";
					winWidth = playarea.offsetWidth - span[butcount].offsetWidth;
					winHeight = playarea.offsetHeight - span[butcount].offsetHeight;
					randomTop = getRandomNumber(0, winHeight);
					randomLeft = getRandomNumber(0, winWidth);
					span[butcount].style.top = randomTop + "px";
					span[butcount].style.left = randomLeft + "px";
					
					
				}
				span.forEach((item, index) => {
					
					item.addEventListener("click", function(){UpdateScoreBoard(index);});
					
				});
			}