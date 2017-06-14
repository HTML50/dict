if (location.href.indexOf('youdao.com') != -1) {
    chrome.runtime.sendMessage({ setHeight: results.clientHeight }, function(response) {
        console.log('[INJECTED dict.cn]set windowHeight: ' + results.clientHeight)
    });
}
