if (location.href.indexOf('youdao.com') != -1) {
  chrome.runtime.sendMessage({ setYoudaoHeight: results.clientHeight }, function(response) {
    console.log('[INJECTED yooudao.com]set windowHeight: ' + results.clientHeight)
  });
}
