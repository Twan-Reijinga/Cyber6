const BRIDGE_URL = "192.168.9.6"  // IP adres van de bridge
const API_KEY = "xjrT-CEWM1jRx0SERlNhwSVjivSrCC8ryZvkHHX2"  //sleutel om de bridge aan te sturen
const BASE_URL = `http://${BRIDGE_URL}/api/${API_KEY}/1/` //beginstuk van de url
var activeGame = false;
var deuntje = [];
var userInput = [];
var brightness = 0;
var keyLock = false;


// voiceDetection //
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'nl-NL';

// DetectKeyPress //
document.onkeypress = function(event){
  if (activeGame && !keyLock && event.keyCode >= 49 && event.keyCode <= 53){
    let lamp = event.keyCode - 48;
    userInput.push(lamp);
    new Audio('audio/toon'+ (lamp) +'.ogg').play();
    if (brightness == 255) {
      blinkLight(lamp)
    }
    if (deuntje.length >= userInput.length) {
      vergelijk();
    } 
    
  } else if(!activeGame && !keyLock) {
    activeGame = true;
    // introduction();
    newGame('aan');
  }
}

function introduction() {
  new Audio('audio/begin.m4a').play();
  setTimeout(function(){recognition.start()}, 5000);
}

recognition.onresult = function(event) {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  newGame(transcript);
}

function newGame(transcript) {
  deuntje = [];
  if (transcript == "uit") { // licht uit
    new Audio('audio/begin spel.m4a').play();
    brightness = 0;
    setTimeout(newRound, 2000);
  } else if (transcript == "fel" || transcript == "aan") { // licht aan
    new Audio('audio/begin spel.m4a').play();
    brightness = 255;
    setTimeout(newRound, 2000);
  } else { // niet verstaan
    new Audio('audio/sorry.m4a').play();
    setTimeout(function(){recognition.start()}, 4000);
  }
}


function newRound() {
  userInput = [];
  newNumber = generateNumber();
  deuntje.push(newNumber);
  console.log(deuntje);
  keyLock = true;
  console.log("lock");
  for (i = 0; i < deuntje.length; i++) {
    let lamp = deuntje[i];
    setTimeout(function(){
      new Audio('audio/toon'+ lamp +'.ogg').play();
    }, 1000*i);

    if (brightness == 255) {
      setTimeout(blinkLight, 1000*i, lamp);
    }
  }
  setTimeout(function() {
    keyLock = false;
    console.log("unlock");
  }, 1000*deuntje.length - 500) 
}


function generateNumber() {
  let randomNumber = Math.floor((Math.random() * 5) + 1); // kans voor zelfde getal = 20%
  if (randomNumber == deuntje[deuntje.length - 1]) { 
    randomNumber = Math.floor((Math.random() * 5) + 1); // kans voor zelfde getal = 4 %
    console.log("better random")
  }
  return randomNumber;
}

function vergelijk() {
  for (i = 0; i < userInput.length; i++) {
    if (deuntje[i] != userInput[i]){
      setTimeout(gameOver, 200);
    } else if (deuntje.length == i + 1) {
      setTimeout(newRound, 1000);
    }
  }
}

function gameOver() {
  activeGame = false;
  new Audio('audio/fout.mp3').play();
  if (brightness == 255) {
    for(i = 0; i < 5; i++) {
      let body = '{"on": true, "hue": 0, "bri": 255}'; // lamp aan
      sendRequest(i, body);
      setTimeout(lightOff, 1000, i);
    }
  }
}

// LightRequest
function blinkLight(lamp) {
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

  let body = '{"on": true, "hue":' + color + ', "bri": 255}'; // lamp aan
  sendRequest(lamp, body);

  setTimeout(lightOff, 500, lamp);
}

function lightOff(lamp) {
  let body = '{"on": false}'; // lamp uit
  sendRequest(lamp, body);
}

function sendRequest(lamp, body){
  let http = new XMLHttpRequest();
  let url = BASE_URL + lampNumber + "/state";
  http.open("PUT", url);
  http.send(body); 
  console.log(lamp + ": " +body)
}