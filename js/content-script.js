//message
var port = chrome.runtime.connect({name: "06"});//通道名称


//kill google ad at dict.cn

if(location.href.indexOf('dict.cn') !=-1){
  var obj = document.querySelectorAll('div[id^="div"]')

  for (let i = 0, item; item = obj[i++];) {
    item.parentNode.removeChild(item);
  }

  var killProcess = setInterval(findNode,50);
  port.postMessage({height: content.children[0].clientHeight });//发送消息: result window height


  function findNode(){
    var node = document.getElementById('dictHcClosetip');
    if(node != null){
        delUselessNode();
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
}

//popup window translation listener
var isSelected = false;
document.addEventListener('mouseup',function(){
  if(isSelected){
    var selectWord = window.getSelection().toString().trim();
    if(selectWord != ''){
      lookup(selectWord)
    }else{
      return false;
    }
  }else{
    return false;
  }
})


//injected window

var injectedHTML = document.createElement("DIV");
injectedHTML.innerHTML='<dictBox id="dictBox" class="dict-box transiton-in">\
<dictBoxBar id="dictBoxBar"><img id="pinOnTop" src="pin.png" title="pin on top" draggable="false" class="not-pinned"></dictBoxBar>\
<iframe id="injectedResultBox" scrolling="no"></iframe>\
</dictBox>';
document.body.appendChild(injectedHTML);

var isMouseDown,
initX,initY,
dictBoxBar = document.getElementById('dictBoxBar'),
isBoxOpened = false,isPinned=false,hiddenProcess,hiddenProcessDetectProcess;

dictBoxBar.addEventListener('mousedown',function(e){
  isMouseDown = true;
  initX = e.clientX - dictBox.offsetLeft;
  initY = e.clientY - dictBox.offsetTop;
  dictBox.style.opacity = 0.5;
})

  document.addEventListener('mousemove',function(e){
    if(isMouseDown){
      dictBox.style.left = (e.clientX - initX) +'px';
      dictBox.style.top = (e.clientY - initY)+'px';
    }
  })
  
dictBoxBar.addEventListener('mouseup',function(){
  isMouseDown = false;
  dictBox.style.opacity = 1;
})

document.addEventListener('mouseup',function(e){
  var selectWord = getSelection().toString().trim();

  if(isBoxOpened == false){
    if(selectWord != ''){
      dictBox.style.left = e.clientX + 20 + 'px';
      dictBox.style.top = e.clientY + 20 + 'px';
      dictBox.style.display = 'block';
      setTimeout(function(){dictBox.classList.add('show-dictBox');},0)
      isBoxOpened = true;//这个true放在lookup()下面就不管用了，难道是因为lookup是content_script中定义的缘故？我一会放在一起试试(yes it is!)
      lookup(selectWord);
      window.getSelection().collapseToStart();
    }
  }else{
    if(selectWord != ''){
      lookup(selectWord);
    }else{
      if( e.target.nodeName == 'DICTBOXBAR' || e.target.nodeName == 'IMG' || isPinned){
      return false;
    }
    dictBox.classList.remove('show-dictBox');
    hiddenProcess = setTimeout(function(){
      dictBox.style.display = 'none';
    },800);
    hiddenProcessDetectProcess = setInterval(function(){
        if(isBoxOpened){
          clearTimeout(hiddenProcess);
          clearInterval(hiddenProcessDetectProcess);
        }
      },16)
    isBoxOpened = false;
    }
  }
    
})


pinOnTop.addEventListener('click',function(e){
  if(isPinned){
    pinOnTop.classList.remove('pinned');
    isPinned = false;
  }else{
    pinOnTop.classList.add('pinned');
    isPinned = true;
  }
  e.stopPropagation();
})

function lookup(w){
  injectedResultBox.src='http://dict.cn/'+w;
}