input.addEventListener('keydown',function(event){
	if(event.keyCode==13){
		if(input.value!=''){
			lookup(input.value);
		}
		else{
			return false;
		}
		input.value = '';
	}
});

function lookup(w){
	result.src='http://dict.cn/'+w;
}
chrome.runtime.onConnect.addListener(function(port) {
   console.assert(port.name == "06");
   port.onMessage.addListener(function(msg) {
   		var h = msg.height;
   		console.log(h)
   		if(h == 52){
   			result.height = 100;
   			result.src = '404.html'
   		}else{
   			result.height = msg.height;
   		}
   });
});