if (location.href.indexOf('youdao.com') != -1) {
    var windowHeight = 52;

    chrome.runtime.sendMessage({ setHeight: results.clientHeight }, function(response) {
        console.log('[INJECTED dict.cn]set windowHeight: ' + results.clientHeight)
    });
}
