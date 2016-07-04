(function () {

  var url = window.location;
    
  getDataForURL = function (storage, url) {
    for (var i = 0; i < storage.length; i++) {
      if (storage[i].url === url) {
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
      if (urlData.secondsActiveToday) {
        urlData.secondsActiveToday++;
      } else {
        urlData.secondsActiveToday = 1;
      }
      chrome.storage.local.set(obj, function () {});
    }
  });


  setInterval(function () {
  
    chrome.storage.local.get(null, function(obj) {
      var urlData = getDataForURL(obj.sites, url);
      console.log('pageload', obj);
      if (urlData) {
        if (urlData.secondsActiveToday) {
          urlData.secondsActiveToday++;
        } else {
          urlData.secondsActiveToday = 1;
        }
        chrome.storage.local.set(obj, function () {});
      }
    });
  
  }, 1000);
  

})();

