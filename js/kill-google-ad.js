var obj = document.querySelectorAll('div[id^="div"]')
for (let i = 0, item; item = obj[i++];) {
  item.parentNode.removeChild(item);
}

var killProcess = setInterval(findNode,50);


function findNode(){
  var node = document.getElementById('dictHcClosetip');
  if(node != null){
      delUselessNode();
  }
  else{
      return console.log('no node found, keep searching!');
  }
}

function delUselessNode(){
  clearInterval(killProcess);
  obj = document.getElementById('content');
  var next = obj.nextSibling;
  while (next!=null){ 
      obj.parentNode.removeChild(next);
      next = obj.nextSibling;
  }
}

var port = chrome.runtime.connect({name: "06"});//通道名称
port.postMessage({set: content.children[0].clientHeight });//发送消息
port.onMessage.addListener(function(msg) {//监听消息
});