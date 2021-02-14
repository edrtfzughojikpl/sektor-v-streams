const socket = io();

const rootElement = document.getElementById("root");
const timeElement = document.getElementById("time");
const Placeholder = document.querySelector(".wrapper");

let Seconds = 0;

let timer = setInterval(() => {
  updateTimer(Seconds);
  Seconds++;
}, 1000);

const updateTimer = (seconds) => {
  passedSeconds = seconds;
  let inSeconds = 150 - passedSeconds;
  var minutes = Math.floor(inSeconds / 60);
  var seconds = inSeconds - minutes * 60;

  timeElement.textContent = `${(minutes<10)?"0"+minutes:minutes}:${(seconds<10)?"0"+seconds:seconds}`;
};

socket.on('data', ({
  channels,
  lastUpdated
}) => {
  console.log(channels, lastUpdated);

  let passedSeconds = calculate(lastUpdated);
  Seconds = passedSeconds;

  channels.forEach(channel => {
    let card = document.querySelector(`[data-name="${channel.user.display_name}"]`);
    if (!card) {
      if (channel.stream) {
        if (channel.stream.game == 'Grand Theft Auto V') {
          createNewCard(channel);
        }
      }
    } else
    if (!channel.stream) {
      console.log(`${card.dataset.name} went offline!`, new Date().toLocaleString());
      card.parentElement.parentElement.remove();
    } else {
      if (channel.stream.game != 'Grand Theft Auto V') {
        console.log(`${card.dataset.name} went offline!`, new Date().toLocaleString());
        card.parentElement.parentElement.remove();
      }
    }
  })
});

const createNewCard = ({
  user,
  stream,
  charInfo
}) => {
  let element = Placeholder.cloneNode(true);
  element.style.display = "block";
  let thumbnailDiv = element.querySelector(".thumbnail");
  let displaynameDiv = element.querySelector(".name");
  // let charnameDiv = element.querySelector(".title");
  // let orgaDiv = element.querySelector(".orga");
  let linkAHref = element.querySelector(".btn");
  // let streamTitleP = element.querySelector(".stream-title");
  let charRow = element.querySelector(".char");
  let otherCharsRow = element.querySelector(".moreChars");

  thumbnailDiv.style.backgroundImage = `url(${user.logo}`;
  thumbnailDiv.style.backgroundPosition = "100% 100%";
  thumbnailDiv.style.backgroundSize = "cover";

  displaynameDiv.dataset.name = user.display_name;
  // charnameDiv.dataset.title = charInfo.character;
  // orgaDiv.dataset.title = charInfo.organisation;
  linkAHref.dataset.link = `www.twitch.tv/${user.display_name}`;
  linkAHref.href = `https://${linkAHref.dataset.link}`;
  linkAHref.target = "_blank";
  // streamTitleP.textContent = stream.channel.status;

  let char = document.createElement("td");
  let orga = document.createElement("td");
  char.textContent = charInfo.character;
  charRow.append(char);
  orga.textContent = charInfo.organisation;
  charRow.append(orga);

  if(charInfo.otherChars){
    let icon = element.querySelector(".icon");
    icon.style.display = "block";
    charInfo.otherChars.forEach((item) => {
      let tr = document.createElement("tr");
      let charTo = document.createElement("td");
      let orgaTo = document.createElement("td");
      charTo.textContent = item.char;
      orgaTo.textContent = item.orga;
      tr.append(charTo);
      tr.append(orgaTo);
      otherCharsRow.append(tr);
    })

  }

  rootElement.appendChild(element);
}

function calculate(lastUpdated) {
  var startTime = new Date(lastUpdated);
  var endTime = new Date();
  const diffTime = Math.abs(endTime - startTime);
  const diffSeconds = Math.ceil(diffTime / (1000));
  return diffSeconds;
}




// { DISABLED! (only plays on HS)
//   "channel": "ShoXx__",
//   "character": "Cole Jones",
//   "organisation": "Zivilist"
// }