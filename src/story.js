function initializePage() {
  const storageKey = 'story.dtda.v0.6.5';
  
  window.story = window.story || {};
  window.story.state = window.story.state || {};

  // cash
  window.story.state.cash = 0;
  window.story.state.showCash = 1;

  // stickers
  window.story.state.sharingCaring = 0; // Sharing is Caring
  window.story.state.smartSaver = 0; // Smart Saver
  window.story.state.creativeThinker = 0; // Creative Thinker
  window.story.state.helpingHand = 0; // Helping Hand
  window.story.state.marketResearcher = 0; // Market Researcher
  window.story.state.helpingPaws= 0; // Helping Paws
  window.story.state.marketingWizard = 0; //Marketing Wizard
  window.story.state.superEntrepreneur = 0; //Marketing Wizard  

  // history
  window.story.state.history = window.story.state.history || {};
  window.story.state.cashOperations = [];

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
      this.superEntrepreneur = data.superEntrepreneur;
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
      this.superEntrepreneur = siData.superEntrepreneur;
      this.showCash = siData.showCash;
      this.cashOperations = siData.cashOperations;
      this.hidePiggyBank = siData.hidePiggyBank || false;
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
      superEntrepreneur: this.superEntrepreneur,
      showCash: this.showCash,
      cashOperations: this.cashOperations,
      hidePiggyBank: this.hidePiggyBank || false
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

  if ( isIndex() ) {
    localStorage.setItem(window.storageKey, JSON.stringify({}));   // if on the index page, clear the localstorage  
    indexFunctions();
  }
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

  document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
      // event.preventDefault();

      const passageFile = event.target.getAttribute('href');
      // Extract the passage name (filename without extension)
      const passageName = passageFile.substring(0, passageFile.lastIndexOf('.'));
      const currentPassage = getPassageIndex();

      console.log("Passage file:", passageName); // Debugging message

      if (window.story.state.history && window.story.state.history[passageName]) {
	console.log("Deleting history for ", passageName);
        delete window.story.state.history[passageName];
	window.story.state.saveDataToLocalStorage(currentPassage);
      }
    }
  });
  document.addEventListener('click', function(event) {

    let clickedSpan = 0;
    
    if ((event.target.tagName === 'SPAN' && event.target.classList.contains('setting'))	||
	(event.target.parentElement.tagName === 'SPAN' && event.target.parentElement.classList.contains('setting')))	{

      console.log("setting span clicked");
      // Get the SVG element within the clicked setting span
      if (event.target.tagName === 'SPAN') 
	clickedSpan = event.target;
      else
	clickedSpan = event.target.parentElement;

      
      if(!clickedSpan.classList.contains('selected')) {

	clickedSpan.classList.add('selected');

	const allSettingSpans = document.querySelectorAll('span.setting');
	allSettingSpans.forEach(settingSpan => {
	  if (settingSpan !== clickedSpan) {
	    settingSpan.classList.remove('selected');
	  }
	});

	const spanId = clickedSpan.id;

	switch (spanId) {

	case  "hideCash":
	  window.story.state.showCash = 0;
	  break;
	case "showCash":
	  window.story.state.showCash = 1;
	  break;
	case "cashAssist":
	  window.story.state.showCash = 2;	  
	  break;
	case "doubleEntryBK":
	  window.story.state.showCash = 3;
	  break;
	default:
	  window.story.state.showCash = 1;
	  break;
	}

	window.story.state.saveDataToLocalStorage(false);
	
      }
    }
  });

  
}

window.onload = initializePage;



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
  if (fileName === 'index' || fileName === '') {
    console.log("Erasing Local Storage.. ");
    return true;
  }

  return false;
}
/*
 hasVisited doesn't but should account for the following possibilities:
 + A user may arrive at a passage previously visited from a different story branch. In this case, the state should be calculated afresh
 The solution I'm implementing is to remove the passage from index, if a user is clicking a link to get to that passage, vs using the browser back or forward buttons
*/  
function hasVisited() {
  const passageIndex = getPassageIndex();
  return !!(window.story.state.history && passageIndex in window.story.state.history); // Using !! to explicitly return boolean
}



function indexFunctions() {
    window.story.state.saveDataToLocalStorage(false); // save default settings
}



function populateStickers() {
  const hhStickerCount = window.story.state.helpingHand;
  const scStickerCount = window.story.state.sharingCaring;
  const ssStickerCount = window.story.state.smartSaver;
  const ctStickerCount = window.story.state.creativeThinker;
  const hpStickerCount = window.story.state.helpingPaws;
  const mrStickerCount = window.story.state.marketResearcher;
  const mwStickerCount = window.story.state.marketingWizard;
  const seStickerCount = window.story.state.superEntrepreneur;
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
    for (let i = 0; i < seStickerCount; i++) {
      const imgElement = document.createElement('img');
      imgElement.className = 'w-[80px] flex-none mr-3 mt-1.5 mb-1.5 drop-shadow-sm';
      imgElement.src = './img/se.svg';
      stickerContainer.appendChild(imgElement);
    }
  }
}

function populateCash() {

  const showCash = window.story.state.showCash;

  switch (showCash) {
  case 0:
    break;
  case 1:
    showFinalCashAmount();
    break;
  case 2:
    showCashWithArithmeticHints();
    break;
  case 3:
    break;
  default:
    showFinalCashAmount();
    break;
  }


}

function showFinalCashAmount() {

  const cashCount = window.story.state.cash;
  const piggyBank = document.getElementById('piggybank');
  const cashText = document.getElementById('cashamount');
  const piggyBankContainer = document.getElementById('piggybankcontainer');    


  if (!window.story.state.hidePiggyBank ) { //hidePiggyBank is a passage-specific toggle
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

function showCashWithArithmeticHints() {

  const piggyBankContainer = document.getElementById('piggybankcontainer-mathassist');
  const newCash = window.story.state.cash;
  const cashOps = window.story.state.cashOperations;
  let prevCash = newCash, cashTracker = newCash, spentCash = [], spentCashDesc = [], earnedCash = [], earnedCashDesc = [];


  if ( cashOps.length === 0 )
    return false;

  cashOps.forEach( op => {

    if ( op.operation === "subtract" ) {
      prevCash = prevCash + op.amount;
      spentCash.push(op.amount);
      spentCashDesc.push(op.description);
    }

    if ( op.operation === "add" ) {
      prevCash = prevCash - op.amount;      
      earnedCash.push(op.amount);
      earnedCashDesc.push(op.description);
    }
    
  });

  cashTracker = prevCash;

  spentCash.forEach((spend, index) => {
    
    const result = cashTracker - spend;
    const templ = document.createElement('template');
    const markup = `
<div class="w-full text-right bg-pink-200 p-2 ${(index === 0) ? 'rounded-t-xl' : ''}">
  <p class="mt-0">Daphne ${(index > 0) ? 'then ' : ''}had $${cashTracker}. She spent $${spend} ${spentCashDesc[index]}</p>
 </div>
 <div id="piggybank-mathassist-subtract-${index}" class="flex flex-row flex-wrap max-w-[384px] box-content p-3 justify-center mx-auto">
 </div>
 <div class="w-full text-right bg-pink-200 p-2">
   <p class="mt-0">${cashTracker} - ${spend} = ${result}</p>
 </div>
`;
    templ.innerHTML = markup;
    piggyBankContainer.append(templ.content);
    const pbSubtract = document.getElementById(`piggybank-mathassist-subtract-${index}`);
    
    for (let i = 0; i < (cashTracker - spend); i++) {
      const cashElement = document.createElement('img');
      cashElement.src = './img/one-cash.svg';
      cashElement.className = 'w-[60px] flex-none mr-3 mt-2 mb-2 drop-shadow-sm';
      pbSubtract.appendChild(cashElement);
    }
    for (let i = 0; i < spend; i++) {
      const cashElement = document.createElement('img');
      cashElement.src = './img/one-cash-spent.svg';
      cashElement.className = 'w-[60px] flex-none mr-3 mt-2 mb-2 drop-shadow-sm';
      pbSubtract.appendChild(cashElement);
    }
    cashTracker = cashTracker - spend;

  });

  earnedCash.forEach( (earned, index) => {
    const result = cashTracker + earned;
    const templ = document.createElement('template');
    const markup = `
<div class="w-full text-right bg-pink-200 p-2 ${(index === 0 && spentCash.length === 0) ? 'rounded-t-xl' : ''}">
  <p class="mt-0">Daphne ${(index > 0) ? 'then ' : ''}earned $${earned} ${earnedCashDesc[index]}</p>
 </div>
 <div id="piggybank-mathassist-add-${index}" class="flex flex-row flex-wrap max-w-[384px] box-content p-3 justify-center mx-auto">
 </div>
 <div class="w-full text-right bg-pink-200 p-2">
   <p class="mt-0">${cashTracker} + ${earned} = ${result}</p>
 </div>
`;
    templ.innerHTML = markup;
    piggyBankContainer.append(templ.content);
    const pbAdd = document.getElementById(`piggybank-mathassist-add-${index}`);
    for (let i = 0; i < (cashTracker); i++) {
      const cashElement = document.createElement('img');
      cashElement.src = './img/one-cash.svg';
      cashElement.className = 'w-[60px] flex-none mr-3 mt-2 mb-2 drop-shadow-sm';
      pbAdd.appendChild(cashElement);
    }
    for (let i = 0; i < earned; i++) {
      const cashElement = document.createElement('img');
      cashElement.src = './img/one-cash-new.svg';
      cashElement.className = 'w-[60px] flex-none mr-3 mt-2 mb-2 drop-shadow-sm border-2 border-blue-600';
      pbAdd.appendChild(cashElement);
    }
    cashTracker = cashTracker + earned;
    
  });

  const templ = document.createElement('template');
  templ.innerHTML = `<div class="w-full text-right bg-pink-200 p-2 rounded-b-xl">
  <p class="mt-0">Daphne now has $${newCash}</p>
</div>`;

  piggyBankContainer.append(templ.content);

  piggyBankContainer.classList.remove("hidden");  

}
