const BRIDGE_URL = "192.168.178.24"  // IP adres van de bridge
const API_KEY = "l1SJ36Y-mE6pM48fRULsOjfFIv2tyV68AWtcXNjB"  //sleutel om de bridge aan te sturen
const BASE_URL = `http://${BRIDGE_URL}/api/${API_KEY}/lights/` //beginstuk van de url

const content = document.querySelector(".content");
const talk = document.querySelector(".talk");
//
var felheid = 125;
var startSpel = false;
var color = 0;
var score = 1;
var scorebord = document.getElementById("scorebord");
scorebord.innerHTML = "Level: " + score;

deuntje = [];
gekozen = [];


randomGetal();
function randomGetal() {
  var x = Math.floor((Math.random() * 5) + 1);
  deuntje += x;
  console.log(deuntje);
}

document.onkeypress = function(event) {
  var x = event.keyCode;
  if (startSpel) { 
    if (x == 49) {
      vergelijk(1);
    }
    if (x == 50) {
      vergelijk(2);
    }
    if (x == 51) {
      vergelijk(3);
    }
    if (x == 52) {
      vergelijk(4);
    }
    if (x == 53) {
      vergelijk(5);
    }
    if (x == 32) { 
      spraak();
    }
  } else {
    if (x == 49) {
      spraak();
    }
    if (x == 50) {
      spraak();
    }
    if (x == 51) {
      spraak();
    }
    if (x == 52) {
      spraak();
    }
    if (x == 53) {
      spraak();
    }
    if (x == 32) {
      spraak();
    }
  }
}

function zetAan(lamp){

  if(lamp == 1) {
    color = 8000;
  } else if (lamp == 2) {
    color = 0;
  } else if (lamp == 3) {
    color = 50000;
  } else if (lamp == 4) {
    color = 38000;
  } else if (lamp == 5) {
    color = 25000;
  }

  console.log(felheid)
  let body = '{"on": true, "hue":' + color + ', "bri":' + felheid + '}';
  sendRequest(lamp, body);
  setTimeout(zetUit, 400, lamp);
  var audio = new Audio('audio/Toon' + lamp +'.ogg');
  audio.play();
}

function roodAan(lamp){
  let body = '{"on": true, "hue": 0, "bri": 150}';
  sendRequest(lamp, body);
  setTimeout(zetUit, 400, lamp);
  var audio = new Audio('audio/Toon' + lamp +'.ogg');
  audio.play();
}

function zetUit(lamp){
  let body = '{"on": false}';
  sendRequest(lamp, body);
//   console.clear();
}

function speelAf(reset){
  startSpel = true;

  if (reset == "true"){
    deuntje = [];
    score = 1;
    scorebord.innerHTML = "Level: " + score;
    over.style.display = "none";
    game_over = "false";
    console.log("game_over: " + game_over);
  }
  randomGetal();
  gekozen = [];
  var i = 0;
  let tijdverschil = 1000;
  game_over = "true";
  while (deuntje[i]){
    setTimeout(zetAan, tijdverschil*i, deuntje[i]);
    i++;
  }
  setTimeout(lockOff, tijdverschil*deuntje.length - 1000);
  console.log(tijdverschil*deuntje.length - 1000)
}

function lockOff() {
  game_over = "false";
  console.log("off " + game_over);
}


function vergelijk(lamp){
  if (game_over == "false") {
    gekozen += lamp;
    var i;
    for (i = 0; i < gekozen.length; i++) {
      if (deuntje[i] != gekozen[i]){
        gekozen = [];
        deuntje = [];
        randomGetal();
        score = 1;
        over.style.display = "block";
        game_over = "true";
        startSpel = false;
        var audio = new Audio('audio/fout.mp3');
        audio.play();
        for (i = 0; i < 6; i++) {
          roodAan(i)
        }
      } else{
        zetAan(lamp);
      }
    }
    if (deuntje == gekozen && gekozen.length >> 0) {
      score ++;
      scorebord.innerHTML = "Level: " + score;
      setTimeout(speelAf, 1000,"false");
      console.log('Level up!');
    }
  }
}

//spraakbedining
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'nl-NL';

function spraak() {
  var audio = new Audio('audio/begin.m4a');
  audio.play();
  setTimeout(function(){ recognition.start(); }, 4200);
}


recognition.onstart = function() {
  console.log('geactiveerd')
};

recognition.onresult = function(event) {
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;

  gebruiker(transcript);
};

function gebruiker(transcript) {
  if (transcript == "uit"){
    var audio = new Audio('audio/begin spel.m4a');
    audio.play();
    setTimeout(function(){ speelAf("true"); }, 2100);
    felheid = 0;
  } else if (transcript == "aan"){
      var audio = new Audio('audio/begin spel.m4a');
      audio.play();
      setTimeout(function(){ speelAf("true"); }, 2100);
      felheid = 0;
    } else if (transcript == "fel"){
      var audio = new Audio('audio/begin spel.m4a');
      audio.play();
      setTimeout(function(){ speelAf("true"); }, 2100);
      felheid = 255;
    } else if (transcript == "vuil"){
      var audio = new Audio('audio/begin spel.m4a');
      audio.play();
      setTimeout(function(){ speelAf("true"); }, 2100);
      felheid = 255;
  } else{
    var audio = new Audio('audio/sorry.m4a');
    audio.play();
    setTimeout(function(){ recognition.start();  }, 3000);
  }
}

// spraakbedining stop


function sendRequest(lampNumber, body){
  if (felheid == 255) {
	let http = new XMLHttpRequest();
  let url = BASE_URL + lampNumber + "/state";
	http.open("PUT", url);
	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200){
		}
	}
  http.send(body); 
}
}

var start = document.getElementById("start");
start.addEventListener("click", () => speelAf("true"));

var input = document.getElementById("input");

var over = document.getElementById("over");
over.style.display = "none";

var lamp1 = document.getElementById("lamp1");
lamp1.addEventListener("click", () => {
  vergelijk(1);
});

var lamp2 = document.getElementById("lamp2");
lamp2.addEventListener("click", () => {
  vergelijk(2);
});

var lamp3 = document.getElementById("lamp3");
lamp3.addEventListener("click", () => {
  vergelijk(3);
});

var lamp4 = document.getElementById("lamp4");
lamp4.addEventListener("click", () => {
  vergelijk(4);
});

var lamp5 = document.getElementById("lamp5");
lamp5.addEventListener("click", () => {
  vergelijk(5);
});