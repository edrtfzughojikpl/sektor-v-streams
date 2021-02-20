/*
```````````````````````./Johannes/.``````````````````````````````````````````````````````````````````
````````````````````:smMMMMNmmmMMNy-````````````````````````````````````````````````````````````````
`````````````````-sNMMNho:.````.+dMMo```````````````````````````````````````````````````````````````
```````````````-hMMMh/.```````````yMMs``````````````````````````````````````````````````````````````
`````````````.yMMMy-```````````````dMM:`````````````````````````````````````````````````````````````
````````````/mMMh-`````````````````/MMy`````````````````````````````````````````````````````````````
```````````+MMNo```````````````````.NMN.````````````````````````````````````````````````````````````
``````````:NMN/`````````````````````hMM/````````````````````````````````````````````````````````````
``````````dMMo``````````````````````oMMs````````````````````````````````````````````````````````````
`````````-MMN.``````````````````````:MMd````````````````````````````````````````````````````````````
`````````-MMm````````````````````````mMM:```````````````````````````````````````````````````````````
`````````.NMN.```````````````````````sMMs```````````````````````````````````````````````````````````
``````````sMMo```````````````````````-NMN-``````````````````````````````````````````````````````````
``````````.mMN-```````````````````````yMMh``````````````````````````````````````````````````````````
```````````/NMd.``````````````````````.mMMs`````````````````````````````````````````````````````````
````````````+MMd.``````````````````````-mMMy.````````````-sdmds-````````````````````````````````````
`````````````/NMm/`````````````...``````-dMMNy:.`````.:+yNMMMMMN-```````````````````````````````````
``````````````-dMMNs``````./ydNMMMd:``````+mMMMMNmmmNMMMMMMMMMMN-```````````````````````````````````
````````````````/ydo````/hMMMMMddMMN-```````:sdNMMMMMMMMMMMMMMh.````````````````````````````````````
``````````````````````:dMMMMd+..mMMo```````````.-:+ooyMMMMMMMy``````````````````````````````````````
````````````````````.yMMMMd:```sMMh`````````````````.dMMMMMMh```````````````````````````````````````
```````````````````-mMMMNo````.NMM:`````````````````+MMMMMMm.```````````````````````````````````````
``````````````````:NMMMN:`````+MMd``````````````````dMMMMMM/````````````````````````````````````````
`````````````````.mMMMN-``````oMMs`````````````````:MMMMMMd``````````````````````-::-.``````````````
`````````````````yMMMM/```````oMMo`````````````````yMMMMMM/```````````````````-yNMMMMNdo.```````````
````````````````:NMMMh````````/MMh````````````````.mMMMMMd```````.:-`````````.dMMMMMMMMMN/``````````
````````````````oMMMM/`````````dMN:```````````````-MMMMMM+``````-mMM/`````````yMMMMMMMMMMN/`````````
````````````````yMMMN.`````````:NMN:``````````````+MMMMMN.`````.mMMy```````````:shmNMMMMMMh`````````
````````````````sMMMN.``````````-dMMy:`````````..`yMMMMMh``````hMMh`````````````````dMMMMMh`````````
````````````````/MMMM+````````````+dMMNdysssydmMMdmMMMMM+`````+MMN.`````````````````hMMMMMo`````````
````````````````.mMMMm.`````````````-+ydmNNNNmdyo/NMMMMN.````.mMMo`````````````````.NMMMMm.`````````
`````````````````:NMMMd-`````````````````````````.NMMMMh`````+MMM-`````````````````sMMMMN:``````````
``````````````````/NMMMNo.```````````````````````:MMMMMo`````dMMm`````````````````:NMMMM+```````````
```````````````````-hMMMMNs:`````````````````````/MMMMM:````.NMMd````````````````-mMMMN/````````````
`````````````````````/dMMMMMms/.`````````````````oMMMMm.````.NMMm.``````````````/NMMMd:`````````````
```````````````````````:yNMMMMMNho:``````````````yMMMMh``````mMMM:````````````-yMMMNs.``````````````
``````````````````````````:ymMMMMMMNho:.`````````dMMMMo``````oMMMd.````````./yNMMNy-````````````````
`````````````````````````````-odNMMMMMMMmy+:.```-NMMMM-```````yMMMNs+///+sdNMMMd+.``````````````````
````````````````````````````````.:sdNMMMMMMMMNdhmMMMMd`````````/dMMMMMMMMMMmy+.`````````````````````
`````````````````````````````````````:+ydNMMMMMMMMMMN:```````````-/osyss+:.`````````````````````````
`````````````````````````````````````````.-/Johannes+.```````````````````````````````````````````````
*/

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
  console.log("einblendungsTyp: " + einblendungsTyp);
});
spielButton(() => {
  setCookie("spielTyp", spielTyp, 365 * 5);
  updateList();
  console.log("spielTyp: " + spielTyp);
});
fraktionButton(() => {
  setCookie("fraktionen", fraktionen, 365 * 5);
  updateList();
  console.log("fraktionen: " + fraktionen);
});


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
      __channels = __channels.sort((a, b) => a.charInfo.organisation.localeCompare(b.charInfo.organisation));
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
      if (fraktionen.includes(channel.charInfo.organisation)) __channels.push(channel);
    }
  });
  return __channels;
}


// { DISABLED! (only plays on HS)
//   "channel": "ShoXx__",
//   "character": "Cole Jones",
//   "organisation": "Zivilist"
// }