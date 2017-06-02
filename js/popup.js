input.addEventListener('keydown',function(event){
	if(event.keyCode==13){
		lookup(input.value);
	}
});

function lookup(w){
	result.src='http://dict.cn/'+w;
}
chrome.runtime.onConnect.addListener(function(port) {
   console.assert(port.name == "06");
   port.onMessage.addListener(function(msg) {
   		console.log('new: '+msg.set)
   		result.height = msg.set;
   });
});