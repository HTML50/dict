var isDragSearch,injectedWindowHeight;

chrome.storage.local.get('isDragSearch',function(data){
    if(data.isDragSearch)
    {
        isDragSearch=true;
    }
    else{
        isDragSearch=false;
    }
    console.log("[BACKGROUND]initial isDragSearch value: "+isDragSearch)
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
	   if(request.setHeight != undefined){
	   		injectedWindowHeight = request.setHeight;
	   		console.log("BACKGROUND: set height")
	      sendResponse({param: "set height ok"});
	    }
	    if(request.get == 'height'){
	   		console.log("BACKGROUND: get height")
	      sendResponse({param: injectedWindowHeight});
	    }
  });