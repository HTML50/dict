var isDragSearch,isCtrlSearch,injectedWindowHeight;

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

chrome.storage.local.get('isCtrlSearch',function(data){
    if(data.isCtrlSearch)
    {
        isCtrlSearch=true;
    }
    else{
        isCtrlSearch=false;
    }
    console.log("[BACKGROUND]initial isCtrlSearch value: "+isCtrlSearch)
});

//全局快捷键打开新标签
chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
        if(command == 'open-dict-global'){
        	chrome.tabs.create({
			url : 'popup.html',
			active : true
		});
        }
      });

//injected页面查询划词搜索响应
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	    if(request.get == "isDragSearch"){
	      sendResponse({param: isDragSearch});
	    }

	     if(request.get == "isCtrlSearch"){
	      sendResponse({param: isCtrlSearch});
	    }


	  if(request.setDragSearch != undefined){
	      isDragSearch = request.setDragSearch;
	      console.log("BACKGROUND: set dragSearch to: "+isDragSearch)
	      sendResponse({param: "set dragSearch to: "+isDragSearch});
	  }

	    if(request.setCtrlSearch != undefined){
	      isCtrlSearch = request.setCtrlSearch;
	      console.log("BACKGROUND: set ctrlSearch to: "+isCtrlSearch)
	      sendResponse({param: "set ctrlSearch to: "+isCtrlSearch});
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