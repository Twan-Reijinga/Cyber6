const BRIDGE_URL = "192.168.178.24"  // IP adres van de bridge
const API_KEY = "l1SJ36Y-mE6pM48fRULsOjfFIv2tyV68AWtcXNjB"  //sleutel om de bridge aan te sturen
const BASE_URL = `http://${BRIDGE_URL}/api/${API_KEY}/lights/` //beginstuk van de url
var activeGame = false;
var lastKeyCode = 0;
var score = 0;

// voiceDetection //
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'nl-NL';

// Wait for keypress to begin game //
document.onkeypress = function(event){
  if (activeGame){
    lastKeyCode = event.keyCode;
  }else {
    // introduction();
    newGame('fel');
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
  let deuntje = [];
  let gekozen = ['hallo', 'hoi']; 
  if (transcript == "uit") { // licht uit
    new Audio('audio/begin spel.m4a').play();
    let brightness = 255;
    newRound(brightness, deuntje, gekozen);
  } else if (transcript == "fel" || transcript == "aan") { // licht aan
    new Audio('audio/begin spel.m4a').play();
    let brightness = 0;
    setTimeout(newRound, 2000, deuntje, gekozen);
  } else { // niet verstaan
    new Audio('audio/sorry.m4a').play();
    setTimeout(function(){recognition.start()}, 4000);
  }
}


function newRound(brightness, deuntje, gekozen) {
  activeGame = true;
  newNumber = generateNumber();
  deuntje += newNumber;
  for (i = 0; i < deuntje.length; i++) {
    lamp = deuntje[i];
    new Audio('audio/toon'+ lamp +'.ogg').play();
    if (brightness == 255) {
      setTimeout(blinkLight, 500*i, lamp);
    }
  }
  lastKeyCode = 0;
  detectKeypress(gekozen, deuntje, brightness)
}

function detectKeypress(gekozen, deuntje, brightness) {
  if (lastKeyCode != 0) {
    lamp = lastKeyCode - 49;
    if (brightness == 255) {
      blinkLight(lamp) // keycode 49 = number1
    }
    gekozen += lamp;
  }
  if (gekozen == deuntje) {
    vergelijk(gekozen, deuntje, brightness);
  } else {
    setTimeout(detectKeypress, 1, gekozen, deuntje, brightness);
  }
}

function generateNumber() {
  let RandomNumber = Math.floor((Math.random() * 5) + 1);
  console.log(RandomNumber);
  return RandomNumber;
}

function vergelijk(gekozen, deuntje, brightness) {
  for(i = 0; i < deuntje.length; i++) {
    if(deuntje[i] != gekozen[i]) {
      gameOver(brightness);
    } else {
      newRound(brightness, deuntje, gekozen);
    }
  }
}

function gameOver(brightness) {
  new Audio('audio/fout.mp3').play();
  if (brightness == 255) {
    for(i = 0; i < 5; i++) {
      let body = '{"on": true, "hue": 0, "bri": 255}'; // lamp aan
      sendRequest(lamp, body);
      setTimeout(lightOff, 800);
    }
  }
  score = 0;
  activeGame = false;
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

  setTimeout(lightOff, 400);
}

function lightOff() {
  let body = '{"on": false}'; // lamp uit
  sendRequest(lamp, body);
}

function sendRequest(lamp, body){
	let http = new XMLHttpRequest();
  let url = BASE_URL + lamp + "/state";
	http.open("PUT", url);
  http.send(body); 
}