var isDragSearch;

//get isDragSearch from background
chrome.runtime.getBackgroundPage(function(w) {
    isDragSearch = w.isDragSearch;
    if (isDragSearch) {
        document.querySelector('#dragSearch .icon').classList.add('enable');
    } else {
        document.querySelector('#dragSearch .icon').classList.remove('enable');
    }
});

input.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        if (input.value != '') {
            lookup(input.value);
        } else {
            return false;
        }
        input.value = '';
    }
});

input.addEventListener('blur', function() {
    input.focus();
});

dragSearch.addEventListener('click', function() {
    if (isDragSearch) {
        document.querySelector('#dragSearch .icon').classList.remove('enable');
    } else {
        document.querySelector('#dragSearch .icon').classList.add('enable');
    }
    chrome.storage.local.set({ 'isDragSearch': !isDragSearch });

    isDragSearch = !isDragSearch;

    //send isDragSearch to background
    chrome.runtime.sendMessage({ setDragSearch: isDragSearch }, function(response) {
        console.log(response.param)
    });

    //send isDragSearch to all tabs
    chrome.tabs.query({}, function(tabs) {
        for(var i=0;i<tabs.length;i++){
            chrome.tabs.sendMessage(tabs[i].id, {dragSearchStatusChange: isDragSearch}, function(response) {
                console.log(response.param);
            });
        }
    });
})

function lookup(w) {
    result.src = 'http://dict.cn/' + w;
}


//recieve dict.cn callback window height
var port = chrome.runtime.connect({ name: "dict" });
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "dict");
    port.onMessage.addListener(function(msg) {
        if (msg.height) {
            var h = msg.height;
            if (h == 52) {
                result.height = 100;
                result.src = '404.html'
            } else {
                result.height = h;
            }
        }
    });
});
