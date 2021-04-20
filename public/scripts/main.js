/*
______/\\\\\\\\\\\_____________________________________________________/\\\\\\\_____________________________/\\\\\___________________________/\\\\\________/\\\\\_        
 _____\/////\\\///____________________________________________________/\\\/////\\\_______________________/\\\\////________________________/\\\\////_______/\\\///__       
  _________\/\\\______________________________________________________/\\\____\//\\\___________________/\\\///__________________________/\\\///___________/\\\______      
   _________\/\\\_________/\\\\\_______________/\\\\\\\\\\\___________\/\\\_____\/\\\__/\\\____/\\\___/\\\\\\\\\\\_____/\\\\\\\\\______/\\\\\\\\\\\_____/\\\\\\\\\___     
    _________\/\\\_______/\\\///\\\____________\///////////____________\/\\\_____\/\\\_\///\\\/\\\/___/\\\\///////\\\__\////////\\\____/\\\\///////\\\__\////\\\//____    
     _________\/\\\______/\\\__\//\\\___________________________________\/\\\_____\/\\\___\///\\\/____\/\\\______\//\\\___/\\\\\\\\\\__\/\\\______\//\\\____\/\\\______   
      __/\\\___\/\\\_____\//\\\__/\\\____________________________________\//\\\____/\\\_____/\\\/\\\___\//\\\______/\\\___/\\\/////\\\__\//\\\______/\\\_____\/\\\______  
       _\//\\\\\\\\\_______\///\\\\\/______________________________________\///\\\\\\\/____/\\\/\///\\\__\///\\\\\\\\\/___\//\\\\\\\\/\\__\///\\\\\\\\\/______\/\\\______ 
        __\/////////__________\/////__________________________________________\///////_____\///____\///_____\/////////______\////////\//_____\/////////________\///_______
*/
let msg =
  "     _    \n" + "    | |  ___  \n" + " _  | | / _ \\ \n" + "| |_| || (_) | \n" + " \\___/  \\___/\n";

console.warn("Made by:\n" + msg)

const rootElement = document.getElementById("root");
const socket = io();

import createNewCard from "./createCard.js";

import {
  settingsButton,
  sortierngsButton,
  onlineofflineButton,
  spielButton,
  fraktionButton
} from "./onClicks.js";

const timeElement = document.getElementById("time");

setInterval(() => {
  updateTimer(Seconds);
  Seconds++;
}, 1000);

const updateTimer = (seconds) => {
  let passedSeconds = seconds;
  let inSeconds = 150 - passedSeconds;
  var minutes = Math.floor(inSeconds / 60);
  var seconds = inSeconds - minutes * 60;

  timeElement.textContent = `${(minutes<10)?"0"+minutes:minutes}:${(seconds<10)?"0"+seconds:seconds}`;
};
const calculate = (lastUpdated) => {
  var startTime = new Date(lastUpdated);
  var endTime = new Date();
  const diffTime = Math.abs(endTime - startTime);
  const diffSeconds = Math.ceil(diffTime / (1000));
  return diffSeconds;
}

socket.on('data', ({
  channels,
  lastUpdated
}) => {
  console.log(channels, lastUpdated);

  _channels = channels;

  let passedSeconds = calculate(lastUpdated);
  Seconds = passedSeconds;

  updateList();
});



const updateList = () => {
  _channels = _channels.sort((a, b) => a.user.display_name.localeCompare(b.user.display_name));
  let __channels = _channels;
  switch (parseInt(sortierungsTyp)) {
    case 1:
      __channels = __channels.sort((a, b) => a.charInfo.charOrga.localeCompare(b.charInfo.charOrga));
      __channels = remove(__channels, "frak");
      break;
    case 2:
      __channels = remove(__channels, "off");
      __channels = __channels.sort((a, b) => {
        return Number(b.stream.viewers) - Number(a.stream.viewers);
      });
      break;
    case 3:
      //  individuell
      break;
    default:
      break;
  }

  rootElement.innerHTML = '';

  switch (parseInt(einblendungsTyp)) {
    case 1:
      __channels = remove(__channels, "on");
      break;
    case 2:

      break;
    case 3:
      __channels = remove(__channels, "on");
      __channels = remove(__channels, "off");
      break;
    default:
      __channels = remove(__channels, "off");
      break;
  }

  __channels.forEach(channel => {
    if (einblendungsTyp == 0 || einblendungsTyp == 2) {
      if (spielTyp == 0) {
        if (!channel.stream) return;
        if (channel.stream.game != 'Grand Theft Auto V') return;
      } else if (spielTyp == 1)
        if (channel.stream) {
          if (channel.stream.game != 'Grand Theft Auto V') channel.notGTA = true;
        }
    }
    createNewCard(channel);
  })
}

const remove = (___channels, type) => {
  let __channels = [];
  ___channels.forEach((channel) => {
    if (type == "off") {
      if (channel.stream) __channels.push(channel);
    } else if (type == "on") {
      if (!channel.stream) __channels.push(channel);
    } else if (type == "frak") {
      if (fraktionen.includes(channel.charInfo.charOrga)) {
        __channels.push(channel);
      } else {
        let isIn = false;
        channel.multiChar.forEach(char => {
          if (!isIn) {
            if(fraktionen.includes(char.charOrga)){
              __channels.push(channel);
              isIn = true;
            };
          }
        })
      }
    }
  });
  return __channels;
}

settingsButton();
sortierngsButton(() => {
  setCookie("sortierungsTyp", sortierungsTyp, 365 * 5);
  updateList();
  console.log("sortierungsTyp: " + sortierungsTyp);
  var checkBoxButtons = document.getElementsByClassName("container2");
  if (sortierungsTyp != 1) {
    document.getElementById('frak').style.filter = "grayscale(0.85)";
    for (var i = 0; i < checkBoxButtons.length; i++) {
      checkBoxButtons[i].firstElementChild.disabled = true;
    }
  } else {
    for (var i = 0; i < checkBoxButtons.length; i++) {
      checkBoxButtons[i].firstElementChild.disabled = false;
    }
    document.getElementById('frak').style.filter = "";
  }
});
onlineofflineButton(() => {
  setCookie("einblendungsTyp", einblendungsTyp, 365 * 5);
  updateList();
  // console.log("einblendungsTyp: " + einblendungsTyp);
});
spielButton(() => {
  setCookie("spielTyp", spielTyp, 365 * 5);
  updateList();
  // console.log("spielTyp: " + spielTyp);
});
fraktionButton(() => {
  setCookie("fraktionen", fraktionen, 365 * 5);
  updateList();
  // console.log("fraktionen: " + fraktionen);
});

// { DISABLED! (only plays on HS)
//   "channel": "ShoXx__",
//   "character": "Cole Jones",
//   "organisation": "Zivilist"
// }