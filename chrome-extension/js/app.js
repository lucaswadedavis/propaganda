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
 
    chrome.storage.sync.get(null,function(obj){
      if (!obj.replacements){
        obj.replacements = [];
        chrome.storage.sync.set({"replacements":[]},function(){
          console.log("initial replacements set");
        });
      }
      app.v.init(obj);
      app.v.listeners();
    });
   
  });

  setInterval(function () {
    chrome.storage.sync.get(null, function (obj) {
      $('.seconds-active').text(obj.duration);
    });
  }, 1000);

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
      var original =  $(this).children()[0].value;
      var replacement = $(this).children()[1].value;

      if (original && replacement){
        s.push({original:original,replacement:replacement});
      }
    });
    
   // simpleStorage.set("replacements",s);
    chrome.storage.sync.set({replacements:s},function(){console.log("saved!");});
  });
};

//////////////////////////////

app.t.splash=function(state){
  var d="";
  d+="<img src='icon.png' alt='counterspell icon' />";
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
  if (replacement === undefined){replacement = {original:"",replacement:""};}
  var d = "";
  d += "<div class='replacement thin-wrapper'>";
    d += "<h2 class='seconds-active'>" + app.m.secondsActive + "</h2>";
    d += "<input type='text' value='"+replacement.original+"' placeholder='url'></input>";
    d += "<input type='text' value='"+replacement.replacement+"' placeholder='points'></input>";
  d += "</div>";
  return d;
};
