const rootElement = document.getElementById("root");
const Placeholder = document.querySelector(".wrapper");

const create = ({
  user,
  stream,
  charInfo,
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

  // charnameDiv.dataset.title = charInfo.character;
  // orgaDiv.dataset.title = charInfo.organisation;
  // streamTitleP.textContent = stream.channel.status;

  let char = document.createElement("td");
  let orga = document.createElement("td");
  char.textContent = charInfo.character;
  charRow.append(char);
  orga.textContent = charInfo.organisation;
  charRow.append(orga);

  //? add info is multischar player
  if (charInfo.otherChars) {
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

  //? if all streams are shown, grayscale offline channels
  if (!stream)
    element.style.filter = "grayscale(1)";

  if (notGTA)
    element.style.filter = "grayscale(0.75)";

  rootElement.appendChild(element);
}

export default create;