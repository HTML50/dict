var isDragSearch;
chrome.storage.local.get('isDragSearch',function(data){
    if(data.isDragSearch)
    {
        isDragSearch=true;
    }
    else{
        isDragSearch=false;
    }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	    if(request.get == "isDragSearch"){
	      sendResponse({param: isDragSearch});
	    }
	  if(request.setDragSearch != undefined){
	      isDragSearch = request.setDragSearch;
	      console.log("BACKGROUND: set dragSearch to: "+isDragSearch)
	      sendResponse({param: "set dragSearch to: "+isDragSearch});
	  }
  });