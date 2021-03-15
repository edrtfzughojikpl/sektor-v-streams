const settingsButton = () => {
  var settingsButton = document.getElementsByClassName("dropbtn");
  var dropDown = document.getElementsByClassName("dropdown-content")[0];
  var settingsButtonOnCick = function () {
    if (dropDown.style.display == "block") {
      dropDown.style.display = "none";
    } else {
      dropDown.style.display = "block";
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
    }
  };

  for (var i = 0; i < settingsButton.length; i++) {
    settingsButton[i].firstElementChild.addEventListener('click', settingsButtonOnCick, false);
  }
}

/**
 * 
 * 
 * 
 * 
 * 
 **/

const sortierngsButton = (callback) => {
  var radioButtons = document.getElementsByClassName("container");

  radioButtons[parseInt(sortierungsTyp)].firstElementChild.checked = true;

  var radioButonOnClick = function () {
    switch (this.parentElement.textContent.replace(/\s/g, '')) {
      case "Fraktion":
        sortierungsTyp = 1;
        break;
      case "Viewer":
        sortierungsTyp = 2;
        break;
      case "Individuell":
        sortierungsTyp = 3;
        break;
      default: //Alphabetisch
        sortierungsTyp = 0;
        break;
    }
    callback();
  };

  for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].firstElementChild.addEventListener('click', radioButonOnClick, false);
  }
}

/**
 * 
 * 
 * 
 * 
 * 
 **/

const onlineofflineButton = (callback) => {
  var checkBoxButtons = document.getElementsByClassName("container0");

  if (einblendungsTyp == 0) {
    checkBoxButtons[0].firstElementChild.checked = true;
    checkBoxButtons[1].firstElementChild.checked = false;
  } else if (einblendungsTyp == 1) {
    checkBoxButtons[0].firstElementChild.checked = false;
    checkBoxButtons[1].firstElementChild.checked = true;
  } else if (einblendungsTyp == 2) {
    checkBoxButtons[0].firstElementChild.checked = true;
    checkBoxButtons[1].firstElementChild.checked = true;
  } else {
    checkBoxButtons[0].firstElementChild.checked = false;
    checkBoxButtons[1].firstElementChild.checked = false;
  }

  var checkBoxButonOnClick = function () {
    if (this.parentElement.textContent.replace(/\s/g, '') == "Offline") {
      if (einblendungsTyp == 0) {
        einblendungsTyp = 2;
      } else if (einblendungsTyp == 1) {
        einblendungsTyp = 3;
      } else if (einblendungsTyp == 2) {
        einblendungsTyp = 0;
      } else {
        einblendungsTyp = 1;
      }

    } else {
      if (einblendungsTyp == 0) {
        einblendungsTyp = 3;
      } else if (einblendungsTyp == 1) {
        einblendungsTyp = 2;
      } else if (einblendungsTyp == 2) {
        einblendungsTyp = 1;
      } else {
        einblendungsTyp = 0;
      }
    }

    callback();
  };

  for (var i = 0; i < checkBoxButtons.length; i++) {
    checkBoxButtons[i].firstElementChild.addEventListener('click', checkBoxButonOnClick, false);
  }
}

/**
 * 
 * 
 * 
 * 
 * 
 **/

const spielButton = (callback) => {
  var spielButtons = document.getElementsByClassName("container1");

  spielButtons[parseInt(spielTyp)].firstElementChild.checked = true;

  var spielButtononClick = function () {
    // console.log(this.parentElement.textContent.replace(/\s/g, ''));
    switch (this.parentElement.textContent.replace(/\s/g, '')) {
      case "GTAV":
        spielTyp = 0;
        break;
      case "alles":
        spielTyp = 1;
        break;
      default:
        break;
    }
    callback();
  };

  for (var i = 0; i < spielButtons.length; i++) {
    spielButtons[i].firstElementChild.addEventListener('click', spielButtononClick, false);
  }
}

/**
 * 
 * 
 * 
 * 
 * 
 **/

const fraktionButton = (callback) => {
  var fraktionButtons = document.getElementsByClassName("container2");
  // console.log(fraktionen);

  for (var i = 0; i < fraktionButtons.length; i++) {
    fraktionButtons[i].firstElementChild.checked = false;
  }

  if (fraktionen.length > 0) {
    var nameArr = fraktionen.split(',');
    nameArr.forEach(fraktion => {
      let found;
      for (var i = 0; i < fraktionButtons.length; i++) {
        if (fraktionButtons[i].textContent.replace(/\s/g, '') == fraktion.replace(/\s/g, '')) {
          found = fraktionButtons[i];
          break;
        }
      }
      found.firstElementChild.checked = true;
    })
  }

  var fraktionButtonsonClick = function () {
    if(fraktionen.length > 0) fraktionen = fraktionen.split(',');
    let pos = fraktionen.indexOf(this.parentElement.textContent.replace(/\s/g, ''));
    if (pos !== -1) {
      fraktionen.splice(pos, 1);
    } else {
      if(fraktionen.length == 0) fraktionen = [];
      fraktionen.push(this.parentElement.textContent.replace(/\s/g, ''));
    }
    fraktionen = fraktionen.join(',');
    callback();
  };

  for (var i = 0; i < fraktionButtons.length; i++) {
    fraktionButtons[i].firstElementChild.addEventListener('click', fraktionButtonsonClick, false);
  }
}

export {
  settingsButton,
  sortierngsButton,
  onlineofflineButton,
  spielButton,
  fraktionButton
};