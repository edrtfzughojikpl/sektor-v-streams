const rootElement = document.getElementById("root");
const Placeholder = document.querySelector(".wrapper");

const create = ({
  user,
  stream,
  charInfo,
  multiChar,
  notGTA
}) => {
  //? create copy of example Element
  let element = Placeholder.cloneNode(true);
  element.style.display = "block";
  let thumbnailDiv = element.querySelector(".thumbnail");
  let displaynameDiv = element.querySelector(".name");
  let linkAHref = element.querySelector(".btn");
  let charRow = element.querySelector(".char");
  let otherCharsRow = element.querySelector(".moreChars");

  // let charnameDiv = element.querySelector(".title");
  // let orgaDiv = element.querySelector(".orga");
  // let streamTitleP = element.querySelector(".stream-title");

  // set profile picture of channel
  thumbnailDiv.style.backgroundImage = `url(${user.logo}`;
  thumbnailDiv.style.backgroundPosition = "100% 100%";
  thumbnailDiv.style.backgroundSize = "cover";

  displaynameDiv.dataset.name = user.display_name;

  linkAHref.dataset.link = `www.twitch.tv/${user.display_name}`;
  linkAHref.href = `https://${linkAHref.dataset.link}`;
  linkAHref.target = "_blank";
  linkAHref.classList.add("tooltip2");
  
  // charnameDiv.dataset.title = charInfo.character;
  // orgaDiv.dataset.title = charInfo.organisation;
  // streamTitleP.textContent = stream.channel.status;

  let char = document.createElement("td");
  let orga = document.createElement("td");
  char.textContent = charInfo.charName;
  charRow.append(char);
  orga.textContent = charInfo.charOrga;
  charRow.append(orga);

  //? add info is multischar player
  if (multiChar.length > 0) {
    let icon = element.querySelector(".icon");
    icon.style.display = "block";
    multiChar.forEach((item) => {
      let tr = document.createElement("tr");
      let charTo = document.createElement("td");
      let orgaTo = document.createElement("td");
      charTo.textContent = item.charName;
      orgaTo.textContent = item.charOrga;
      tr.append(charTo);
      tr.append(orgaTo);
      otherCharsRow.append(tr);
    })

  }

  //? if all streams are shown, grayscale offline channels
  if (!stream)
    element.style.filter = "grayscale(1)";

  if (notGTA)
    element.style.filter = "grayscale(0.75)";

  if(stream) {
    let span = document.createElement("span");
    span.style.background = `#772ce8 url(${stream.preview.medium}) repeat-x 0 0`;
    linkAHref.append(span);
  }
  
  rootElement.appendChild(element);
}

export default create;