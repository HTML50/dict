
var getList= ['footer','loginAuth','login-popup','header','head-bk','head-bar','exp-rating','noteRelate','addNote','masker','ExpSYN','ExpLJ','customize-tabs','word-thumbnail-image','ExpSPEC','selectTransArea','trans','mwCA-en'],
	queryList = ['.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all','.expHead','.explain-word-info'],
	parentList = ['scrollToTop','globalVoice']//id
	safeNodeList = [],
	len = getList.length,
	rsHeight = 0;



for(let i=0;i<len;i++){
	getSafeNode(getList[i],'get')
}

for(let i=0,len = queryList.length;i<len;i++){
	getSafeNode(queryList[i],'querySelector')
}

getSafeNode('.gv_content','querySelector','nextSibling')


for(let i=0,len = parentList.length;i<len;i++){
	getSafeNode(parentList[i],'get','parentNode')
}


function getSafeNode(name,method,addition){
	if(!addition){
		if(method==='get'){
			var node = document.getElementById(name);
			if(node){
				safeNodeList.push(node);
			}else{
				return;
			}
		}else{
			var node = document.querySelector(name);
			if(node){
				safeNodeList.push(node);
			}else{
				return;
			}
		}
	}else{
		if(addition==='parentNode'){
			var node = document.getElementById(name);
			if(node){
				safeNodeList.push((node.parentNode))
			}else{
			return;
			}
		}else{
			var node = document.querySelector(name);
			if(node){
				safeNodeList.push(node.nextSibling)
			}else{
			return;
			}
		}

	}

}

function removeNodes(arr){
	var i=0,len = arr.length;
	for(i;i<len;i++){	
		removeNode(arr[i]);
	}
}


function removeNode(node){
		try{
	node.parentNode.removeChild(node);
		}
	catch(e){
		console.log(e)
	}
}


removeNodes(safeNodeList);


rsHeight = document.getElementById('dict-body').clientHeight;
if(!rsHeight == 0){
	rsHeight += 20;
}
chrome.runtime.sendMessage({ setHeight: rsHeight }, function(response) {
console.log('[INJECTED eduic.net]set windowHeight: ' + rsHeight)
});
