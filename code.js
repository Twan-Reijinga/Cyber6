const BRIDGE_URL = "192.168.178.24"  // IP adres van de bridge
const API_KEY = "l1SJ36Y-mE6pM48fRULsOjfFIv2tyV68AWtcXNjB"  //sleutel om de bridge aan te sturen
const BASE_URL = `http://${BRIDGE_URL}/api/${API_KEY}/lights/` //beginstuk van de url
var activeGame = false;

//voiceDetection
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'nl-NL';


document.onkeypress = function(event) {
  keycode = event.keyCode;
  if (!activeGame){
    introduction();
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
  var deuntje = [];
  var gekozen = [];
  if (transcript == "uit") {
    new Audio('audio/begin spel.m4a').play();
    let brightness = 255;
    main(brightness);
  } else if (transcript == "fel") {
    new Audio('audio/begin spel.m4a').play();
    let brightness = 0;
    main(brightness);
  } else {
    new Audio('audio/sorry.m4a').play();
    recognition.start()
  }
}

function main(brightness){
  let RandomNumber = Math.floor((Math.random() * 5) + 1);
  deuntje += RandomNumber;
  console.log("brightness: " + brightness + " number: " + RandomNumber)
}