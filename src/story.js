function initializePage() {
  const storageKey = 'story.dtda.v0.41';
  
  window.story = window.story || {};
  window.story.state = window.story.state || {};

  // cash
  window.story.state.cash = 0;
  window.story.state.showCash = false;

  // stickers
  window.story.state.sharingCaring = 0; // Sharing is Caring
  window.story.state.smartSaver = 0; // Smart Saver
  window.story.state.creativeThinker = 0; // Creative Thinker
  window.story.state.helpingHand = 0; // Helping Hand
  window.story.state.marketResearcher = 0; // Market Researcher
  window.story.state.helpingPaws= 0; // Helping Paws
  window.story.state.marketingWizard = 0; //Marketing Wizard

  // history
  window.story.state.history = window.story.state.history || {};

  window.story.state.loadDataFromLocalStorage = function() {
    console.log("loadDataFromLocalStorage: Function called"); // Debug log
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const data = JSON.parse(storedData);
      this.cash = data.cash;
      this.helpingHand = data.helpingHand;
      this.sharingCaring = data.sharingCaring;
      this.smartSaver = data.smartSaver;
      this.creativeThinker = data.creativeThinker;
      this.marketResearcher = data.marketResearcher;
      this.helpingPaws = data.helpingPaws;
      this.marketingWizard = data.marketingWizard;
      this.showCash = data.showCash;
      this.history = data.history;
      console.log("Loaded Story Data: ", data); // Debug log      
    }
    else
      console.log("nothing in local storage");
      return false;
  };

  window.story.state.loadDataFromHistory = function(passageIndex) {
    console.log("Loading saved story data for ", passageIndex); // Debug log
    const siData = this.history[passageIndex];
    if (siData) {
      this.cash = siData.cash;
      this.helpingHand = siData.helpingHand;
      this.sharingCaring = siData.sharingCaring;
      this.smartSaver = siData.smartSaver;
      this.creativeThinker = siData.creativeThinker;
      this.marketResearcher = siData.marketResearcher;
      this.helpingPaws = siData.helpingPaws;
      this.marketingWizard = siData.marketingWizard;
      this.showCash = siData.showCash;
      console.log("Loaded saved story data for ", passageIndex); // Debug log      
    }
    else
      return false;
  }

  window.story.state.saveDataToLocalStorage = function(passageIndex) {
    console.log("saveDataToLocalStorage: Function called"); // Debug log
    const data = {
      cash: this.cash,
      helpingHand: this.helpingHand,
      sharingCaring: this.sharingCaring,
      smartSaver: this.smartSaver,
      creativeThinker: this.creativeThinker,
      marketResearcher: this.marketResearcher,
      helpingPaws: this.helpingPaws,
      marketingWizard: this.marketingWizard,
      showCash: this.showCash,
      //previousPassage: this.previousPassage
    };
    
    if ( passageIndex ) {
      this.history = this.history || {};
      this.history[passageIndex] = structuredClone(data);
    }
    const passagesHistory = { history : (this.history || {}) };
    const dataPackage = Object.assign(data, passagesHistory);
    localStorage.setItem(storageKey, JSON.stringify(dataPackage));
    console.log("Saved story data"); // Debug log          
  };

  // if on the index page, clear the localstorage  
  if ( isIndex() ) 
    localStorage.setItem(storageKey, JSON.stringify({}));
  else 
    window.story.state.loadDataFromLocalStorage();

  const visitedPassage = hasVisited();
  const passageIndex = getPassageIndex();
  if ( visitedPassage && passageIndex ) { // don't run passageScript
    window.story.state.loadDataFromHistory(passageIndex);
    populateCash();
    populateStickers();
    window.story.state.saveDataToLocalStorage(passageIndex);          
  } 
  else { // reader hasn't visited current passage before
    if (typeof passageScript === 'function') {
      console.log("inline function called");
      passageScript(); // call the inline script function in the page
      populateCash();
      populateStickers();
      window.story.state.saveDataToLocalStorage(passageIndex);          
    }
  }
  
}

window.onload = initializePage;

window.addEventListener("popstate", (event) => {
  console.log("popstate called");
});

function getPassageIndex() {
  const path = window.location.pathname;
  let fileName = path.substring(path.lastIndexOf('/') + 1);
  const dotIndex = fileName.lastIndexOf('.');

  if (dotIndex > 0) {
    fileName = fileName.substring(0, dotIndex);
  }
  if (fileName === 'index') 
    return false;
  else
    return fileName;
    
}

function isIndex() {
  const path = window.location.pathname;
  let fileName = path.substring(path.lastIndexOf('/') + 1);
  const dotIndex = fileName.lastIndexOf('.');

  if (dotIndex > 0) {
    fileName = fileName.substring(0, dotIndex);
  }
  if (fileName === 'index') 
    return true;

  return false;
}
/*
 hasVisited doesn't but should account for the following possibilities:
 + A user may arrive at a passage previously visited from a different path. In this case, the state should be calculated afresh
*/  
function hasVisited() {
  const passageIndex = getPassageIndex();

  if(window.story.state.history && passageIndex in window.story.state.history) 
    return passageIndex;

  return false;
}

function populateStickers() {
  const hhStickerCount = window.story.state.helpingHand;
  const scStickerCount = window.story.state.sharingCaring;
  const ssStickerCount = window.story.state.smartSaver;
  const ctStickerCount = window.story.state.creativeThinker;
  const hpStickerCount = window.story.state.helpingPaws;
  const mrStickerCount = window.story.state.marketResearcher;
  const mwStickerCount = window.story.state.marketingWizard;  
  const stickerContainer = document.getElementById('stickers');

  if (stickerContainer) {
    stickerContainer.innerHTML = '';

    for (let i = 0; i < hhStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/hh2.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < scStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/sc2.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < ssStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/ss.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < ctStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/ct.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < hpStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/hp.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < mrStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/mr.svg';
      stickerContainer.appendChild(imgElement);
    }

    for (let i = 0; i < mwStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/mw.svg';
      stickerContainer.appendChild(imgElement);
    }


  }
}

function populateCash() {

  const cashCount = window.story.state.cash;
  const showCash = window.story.state.showCash;
  const piggyBank = document.getElementById('piggybank');
  const cashText = document.getElementById('cashamount');
  const piggyBankContainer = document.getElementById('piggybankcontainer');    

  if (showCash) {
    for (let i = 0; i < cashCount; i++) {
      const cashElement = document.createElement('img');
      cashElement.src = './img/one-cash.svg';
      cashElement.className = 'w-[60px] flex-none mr-3 mt-2 mb-2 drop-shadow-sm';
      piggyBank.appendChild(cashElement);
    }
    cashText.textContent = cashCount.toString();
    piggyBankContainer.classList.remove("hidden");
    
    
  }

}
