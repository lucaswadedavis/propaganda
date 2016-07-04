(function () {

  var url = window.location.host;
    
  getDataForURL = function (storage, url) {
    for (var i = 0; i < storage.length; i++) {
      if (storage[i].url.includes(url) || url.includes(storage[i].url)) {
        return storage[i];
      }
    }

    return null;
  };

  
  chrome.storage.local.get(null,function(obj){
    if (!obj.sites){
      obj.sites = [];
      chrome.storage.local.set(obj,function(){});
    }
 
    var urlData = getDataForURL(obj.sites, url);

    if (urlData) {
      console.log(urlData);
      if (urlData.secondsActiveToday) {
        urlData.secondsActiveToday++;
      } else {
        urlData.secondsActiveToday = 1;
      }
      
      console.log('--- initial', obj);
      chrome.storage.local.set(obj, function () {});
      
    }
  });


  setInterval(function () {
  
    chrome.storage.local.get(null, function(obj) {
      console.log(obj, url);
      var urlData = getDataForURL(obj.sites, url);
      if (urlData) {
        if (urlData.secondsActiveToday) {
          urlData.secondsActiveToday++;
        } else {
          urlData.secondsActiveToday = 1;
        }
      
        console.log(obj);
        chrome.storage.local.set(obj, function () {});
      }
    });
  
  }, 1000);
  

})();

