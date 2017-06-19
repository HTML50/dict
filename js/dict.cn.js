//message
var port = chrome.runtime.connect({ name: "dict" });

//kill google ad at dict.cn
if (location.href.indexOf('dict.cn') != -1) {
  var obj = document.querySelectorAll('div[id^="div"]'),
    windowHeight;

  for (let i = 0, item; item = obj[i++];) {
    item.parentNode.removeChild(item);
  }

  var killProcess = setInterval(findNode, 50);

  if (document.querySelector('.not') != null) {
    windowHeight = 52;
  } else {
    windowHeight = content.children[0].clientHeight;
  }
  port.postMessage({ height: windowHeight });

  chrome.runtime.sendMessage({ setHeight: windowHeight }, function(response) {
    console.log('[INJECTED dict.cn]set windowHeight: ' + windowHeight)
  });


  function findNode() {
    var node = document.getElementById('dictHcClosetip');
    if (node != null) {
      delUselessNode();
    }
  }

  function delUselessNode() {
    clearInterval(killProcess);
    obj = document.getElementById('content');
    var next = obj.nextSibling;
    while (next != null) {
      obj.parentNode.removeChild(next);
      next = obj.nextSibling;
    }
  }
}
