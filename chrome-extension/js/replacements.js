(function () {

  var url = window.location;
  
  
  chrome.storage.sync.get(null,function(obj){
    if (!obj.replacements){
      obj.replacements = [];
      chrome.storage.sync.set(obj,function(){});
    }
    
    if (!obj.duration) {
      obj.duration = 1;
      chrome.storage.sync.set(obj, function () {});
    }
  });


  setInterval(function () {
     chrome.storage.sync.get(null, function(obj) {
        if (!obj.duration) obj.duration = 0;
        obj.duration++;
        chrome.storage.sync.set(obj, function () {
          
          if (obj.duration % 3 === 0) {

            //alert(url);
          }
        });
      });
  }, 1000);
  

})();

