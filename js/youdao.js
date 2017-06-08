//message
var port = chrome.runtime.connect({ name: "dict" }); //通道名称


//kill google ad at dict.cn

if (location.href.indexOf('dict.cn') != -1) {
    var obj = document.querySelectorAll('div[id^="div"]')

    for (let i = 0, item; item = obj[i++];) {
        item.parentNode.removeChild(item);
    }

    var killProcess = setInterval(findNode, 50);

    if(document.querySelector('.not') != null){
      port.postMessage({height: 52});
    }else{
      port.postMessage({ height: content.children[0].clientHeight }); //发送消息: result window height
      
    }
    
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
