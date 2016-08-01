(function () {

  var url = window.location.host;
 
  var progressPixel = ProgressPixel();
  var scoreBoard = ScoreBoard();
  var fullCountDown = 60;
  var currentCountDown = fullCountDown;
  var replacements = [
    "the",
    "a"
  ];

  var todayString = (new Date()).toDateString();
  
  document.body.appendChild(progressPixel);
  document.body.appendChild(scoreBoard);

  chrome.storage.local.get(null,function(storage){
    if (!storage.sites){
      storage.sites = [];
      chrome.storage.local.set(storage,function(){});
    }

    if (!storage.currentDay) {
      storage.currentDay = todayString;
    } else if (storage.currentDay !== todayString) {
      for (var i = 0; i < storage.sites; i++) {
        storage.sites[i].secondsActiveToday = 1;
      }
    }

    var urlData = getDataForURL(storage.sites, url);

    if (urlData) {
      if (urlData.secondsActiveToday) {
        urlData.secondsActiveToday++;
        currentCountDown = Math.floor(60 - (urlData.secondsActiveToday % 60));
      } else {
        urlData.secondsActiveToday = 1;
      }
      
      chrome.storage.local.set(storage, function () {});
      
    }
  });


  setInterval(function () {
  
    chrome.storage.local.get(null, function(storage) {
           
      var score = 0;
      for (var i = 0; i < storage.sites.length; i++) {
        score += Math.floor(storage.sites[i].secondsActiveToday / 60) * parseInt(storage.sites[i].pointValue, 10) || 0;
      }
      scoreBoard.innerText = score;

      
      
      var urlData = getDataForURL(storage.sites, url);
      if (urlData) {
        if (urlData.secondsActiveToday) {
          currentCountDown < 1 ? (currentCountDown = fullCountDown) : currentCountDown--;
          dress(progressPixel, {height: (currentCountDown * 100 / fullCountDown) + '%'});
          urlData.secondsActiveToday++;
        } else {
          urlData.secondsActiveToday = 1;
        }
        chrome.storage.local.set(storage, function () {});
      }
    
   
    });
 
  }, 1000);


  function el (tag) {
    return document.createElement(tag); 
  }

  function dress (node) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        node.style[key] = arguments[i][key];
      }
    }
    return node;
  }

  function ProgressPixel () {
    var bar = el('div');
    var height = 100;
    var style = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '3px',
      zIndex: '999',
      height: height + '%',
      backgroundColor: '#f33'
    };

    return dress(bar, style);
  }

  function ScoreBoard () {
    var scoreBoard = el('span');
    var style = {
      position: 'fixed',
      left: '10px',
      top: (window.innerHeight - 50) + 'px',
      padding: '10px',
      color: '#f33'
      //background: 'rgba(255, 255, 255, 0.3)'
    }

    return dress(scoreBoard, style);
  }

  function getDataForURL (storage, url) {
    for (var i = 0; i < storage.length; i++) {
      if (storage[i].url.includes(url) || url.includes(storage[i].url)) {
        return storage[i];
      }
    }

    return null;
  }



  function walk(node,replacements){
    // I stole the recursive dom walker function from here:
    // http://is.gd/mwZp7E

    var child, next;

    switch ( node.nodeType )  
    {
      case 1:  // Element
      case 9:  // Document
      case 11: // Document fragment
        child = node.firstChild;
        while ( child ) 
        {
          next = child.nextSibling;
          walk(child,replacements);
          child = next;
        }
        break;

      case 3: // Text node
        //handleText(node);
        counterspell(node,replacements);
        break;
    }
  };

  function counterspell(textNode, replacements){
    var d = textNode.nodeValue;
    for (var i in replacements){
      var pattern = new RegExp(("\\b"+replacements[i].original+"\\b"),"g");
      d = d.replace(pattern,replacements[i].replacement);
    }

    textNode.nodeValue = d;
  };


})();

