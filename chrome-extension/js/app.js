$(document).ready(function(){
	app.c.init();
});
/////////////////////////////

var app={m:{},v:{},c:{},t:{}};

/////////////////////////////

app.m.secondsActive = 0;

/////////////////////////////

app.c.init=function(){

  chrome.tabs.query({
    'active': true,
    'windowId': chrome.windows.WINDOW_ID_CURRENT},function (tabs) {
     app.m.tabURL = tabs[0].url;
 
    chrome.storage.local.get(null,function(obj){
      if (!obj.replacements){
        obj.replacements = [];
        chrome.storage.local.set({"replacements":[]},function(){
          console.log("initial replacements set");
        });
      }
      app.v.init(obj);
      app.v.listeners();
    });
   
  });

  setInterval(function () {
    chrome.storage.local.get(null, function (obj) {
      var urlData = app.c.getDataForURL(obj, app.m.tabURL);
      console.log(obj);
      if (urlData) {
        $('.seconds-active').text(urlData.secondsActiveToday);
      }
    });
  }, 1000);

};

app.c.getDataForURL = function (storage, url) {
  for (var i = 0; i < storage.length; i++) {
    if (storage[i].url === url) {
      return storage[i];
    }
  }

  return null;
};

//////////////////////////////

app.v.init=function(state){
	$("body").html(app.t.splash(state) );
};


app.v.listeners=function(){ 
  $("body").on("click","#add-another",function(){
    $("#replacements").append(app.t.replacement() );
  });

  $("body").on("click","#save",function(){

    var s = [];
    
    $("#replacements div").each(function(){
      var url =  $(this).children()[0].value;
      var replacement = $(this).children()[1].value;
  

      console.log(url, replacement);
      if (url && replacement){
        s.push({url:url,replacement:replacement});
      } 

    
    });
       
    console.log('clicked save');

    chrome.storage.local.get(null, function (storage) {
      console.log('storage', storage);
      console.log('s', s); 
      
      for (var i = 0; i < s.length; i++) {
        var matchFound = false;

        for (var j = 0; i < storage.replacements.length; j++) {
          if (s[i].url === storage.replacements[j].url) {
            matchFound = true;
            console.log('match found');
          }

        }

        if (matchFound === false) {
          console.log('no match found, adding data');
          storage.replacements.push(s[i]);
        }
      }

      console.log('new storage', storage);

      chrome.storage.local.set(storage, function () {});
    });
 

    /*
    chrome.storage.local.set({replacements:s},function(){console.log("saved!");});
   */
  
  
  });
};

//////////////////////////////

app.t.splash=function(state){
  var d="";
  d+="<img src='icon.png' alt='counterspell icon' />";
  d += "<h2 class='seconds-active'>" + app.m.secondsActive + "</h2>";
  d+="<div class='wrapper'>";
    d+=app.t.replacements(state.replacements );
  d+="<input type='button' value='Save' id='save'></input>";
  d+="</div>";    
  return d;
};

app.t.replacements = function(replacements){
  var d = "";
  d += "<div class='thin-wrapper' id='replacements'>";
    for (var i=0;i<replacements.length;i++){
      d += app.t.replacement(replacements[i]);
    }
  d += "</div>";
  d += "<input type='button' value='add another' id='add-another'></input>";
  return d;
};

app.t.replacement = function(replacement){
  if (replacement === undefined){replacement = {url:"",replacement:""};}
  var d = "";
  d += "<div class='replacement thin-wrapper'>";
    d += "<input type='text' value='"+replacement.url+"' placeholder='url'></input>";
    d += "<input type='text' value='"+replacement.replacement+"' placeholder='points'></input>";
  d += "</div>";
  return d;
};
