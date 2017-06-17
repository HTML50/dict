var isDragSearch,isCtrlSearch;
//划词搜索

//获取划词搜索是否开启
chrome.runtime.getBackgroundPage(function(w) {
    isDragSearch = w.isDragSearch;
    isCtrlSearch = w.isCtrlSearch;
    dragAndSearchStatus.checked = isDragSearch;
    ctrlSearchStatus.checked = isCtrlSearch;
    ctrlSearchStatus.disabled = true ? false:isDragSearch;
	if(!isDragSearch){
		ctrlSearchStatus.labels[0].classList.add('del')
	}
});

//获取快捷键值
chrome.commands.getAll(function(data) {
		var extensionPopup,globalSearch;
		
		for (var i = 0, l = data.length; i < l; i++) {
			switch (data[i].name) {
				case '_execute_browser_action':
					extensionPopup = String(data[i].shortcut).replace(/\+/g, ' + ') || '&lt;未定义&gt;';
				break;
				case 'open-dict-global':
					globalSearch = String(data[i].shortcut).replace(/\+/g, ' + ') || '&lt;未定义&gt;';
				break;
			}
		}
		
		searchHotkey.innerHTML = extensionPopup;
		gloablSearchHotkey.innerHTML = globalSearch;
	});


//打开 快捷键设置
openSettings.addEventListener('click',function(e) {
		e.preventDefault();
		chrome.tabs.create({
			url : 'chrome://extensions/configureCommands',
			active : true
		});
	})

//打开 github
github.addEventListener('click',function(e) {
		e.preventDefault();
		chrome.tabs.create({
			url : 'http://github.com/html50/dict',
			active : true
		});
	})



//设定划词
dragAndSearchStatus.addEventListener('click', function() {

    chrome.storage.local.set({ 'isDragSearch': !isDragSearch });

    isDragSearch = !isDragSearch;
    //send isDragSearch to background
    chrome.runtime.sendMessage({ setDragSearch: isDragSearch }, function(response) {
        console.log(response.param)
    });

    //send isDragSearch to all tabs
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { dragSearchStatusChange: isDragSearch }, function(response) {
                console.log(response.param);
            });
        }
    });
})

//设定ctrl划词
ctrlSearchStatus.addEventListener('click', function() {

    chrome.storage.local.set({ 'isCtrlSearch': !isCtrlSearch });

    isCtrlSearch = !isCtrlSearch;
    //send setCtrlSearch to background
    chrome.runtime.sendMessage({ setCtrlSearch: isCtrlSearch });

    //send isCtrlSearch to all tabs
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { ctrlSearchStatusChange: isCtrlSearch });
        }
    });
})



//设置更改保存提示
document.addEventListener('change',function(){
	status.innerHTML = '更改已保存';
})

//返回搜索页
backward.addEventListener('click',function(){
	location.href='popup.html'
})

//划词搜索值改变联动
dragAndSearchStatus.addEventListener('change',function(){
	if(!dragAndSearchStatus.checked){
		ctrlSearchStatus.disabled = true;
		ctrlSearchStatus.labels[0].classList.add('del')
	}else{
		ctrlSearchStatus.disabled = false;
		ctrlSearchStatus.labels[0].classList.remove('del')
	}

});