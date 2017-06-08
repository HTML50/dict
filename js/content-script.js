if (location.href.indexOf('dict.cn') == -1 && location.href.indexOf('youdao.com') == -1) {
    init();
}

function init() {

    var isDragSearch;

    //get isDragSearch from background when injected
    chrome.runtime.sendMessage({ get: "isDragSearch" }, function(response) {
        isDragSearch = response.param;
        console.log('[INJECTED] get from background: ' + isDragSearch)
    });


    //get isDragSearch from popup window when the value is changed
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request)
            if (request.dragSearchStatusChange != undefined) {
                isDragSearch = request.dragSearchStatusChange;
                console.log("enable dragSearch: " + isDragSearch)
                sendResponse({ param: "Injected: enable dragSearch: " + isDragSearch });
            }
        });



    //injected window
    var injectedHTML = document.createElement("DIV");
    injectedHTML.innerHTML = '<dictBox id="dictBox" class="dict-box transiton-in">\
  <dictBoxBar id="dictBoxBar"><img id="pinOnTop" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3QUQAAQwuDiIFgAAAxVJREFUWMPF1ktoXFUcx/HPnTszycxkUqpCVKhgxU2pxUexWHfSnYvSjSAqPmt1ITWWuvRRV1qkoIiLCKIbUVA3KvW5UjD4QtAsrIq0UVMJpmKbmMfc62LuDDe3k5vbSao/OHDvef2+5/E/5/A/K1hrBx9NPNozf9eWZwq1L62TeYAt2IHBPLB1BUgUYj8+TNKTqBeFWA+AnXgMl6KJA+cC0TdAKexun63YmJmR0aIQfQNErbjz+QG+yBQXhliPJfgJ9+HrfiByw7BXg054Zco2YyyO45uC4KwuWziCxzGb7iMXIGNQQpykbP6epPOrFuaXBEGgUg0LQ/QESJnXE4ObcRrP4buk7GLtHX8/hiGKYn+fmlNrVFUHyoUgylZWqB1eB+jWuzYx3ICncOOy6SgFqoMVf83M2nBBXbVazvY3mnx3IfI2YQufYiqVdx3ewGtZ845q9YqwHJqZPmNhYanXoB7GLek1zNM72IcTqbwrMJLXqDk8KGrFZqbPzLWWoqlMcRmbcgEyF8l7eCADkatKNdRoDlicb43FcbwHX6WKJ7XPjvwZWCvEUHNgvD5UPby0GH2Oe/E63sSdGC+0BMviNWhDBIFfClzip0ph6VCtUZ38fXIGvsUduBWfpCuGq/X06gufuXLzNpPHFty1+9iP1+9obmsMh9dUB3IpnsZLlUpo44WNTl6UpGWDW3Usowf3pmdrfxx7YmRTZXjrzrraUOnso4n3cTums7PYS7lLkDXHoSAwfPLEoonx2amo5WSmyRJe6ZgX0YoAvcwxBEHg+G8/L9xdKrnH8o1ZxiO4ek0AeeY4jn21ofDo/D9xr+jYjmdxUV8ARcxxdO50pNYI6B2i23H5OQMUNYdSSNTqNs1CfK/9TigOkDKnfeGsaA5HDo/1OqwexASex599LQF2ab9ics27lZdDvIvdeKuIOck5kBr9CN7GDcn/D3hI6uxOm6eV93rKU/Y9sDdl/jEO4pvVzIuarQZwGW7Dr3gRY/ijiPlalAa4BC9rvwEm0pXOl3kW4Eupa/J8G/cC6Eb1f2Hc0b/FhAOhNRRq5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxOTowMyswODowMOVzP7kAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMDUtMTZUMDA6MDQ6NDgrMDg6MDCjG60mAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADI1NunDRBkAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMjU2ejIURAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzY4NjMzODg49kUYbQAAABJ0RVh0VGh1bWI6OlNpemUAMy4zOEtCjlYEugAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTExMzQvMTExMzQ1MC5wbmfyvQGEAAAAAElFTkSuQmCC" title="pin on top" draggable="false" class="not-pinned"></dictBoxBar>\
  <iframe id="injectedResultBox" scrolling="no"></iframe>\
  </dictBox>';
    document.body.appendChild(injectedHTML);

    var isMouseDown,
        initX, initY,
        dictBoxBar = document.getElementById('dictBoxBar'),
        isBoxOpened = false,
        isPinned = false,
        hiddenProcess, hiddenProcessDetectProcess;

    dictBoxBar.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        initX = e.clientX - dictBox.offsetLeft;
        initY = e.clientY - dictBox.offsetTop;
        dictBox.style.opacity = 0.5;
    })

    document.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            dictBox.style.left = (e.clientX - initX) + 'px';
            dictBox.style.top = (e.clientY - initY) + 'px';
        }
    })

    dictBoxBar.addEventListener('mouseup', function() {
        isMouseDown = false;
        dictBox.style.opacity = 1;
    })

    document.addEventListener('mouseup', function(e) {
        var selectWord = getSelection().toString().trim();
        if (isDragSearch) {
            if (!isBoxOpened) {
                if (selectWord != '') {
                    dictBox.style.left = e.clientX + 20 + 'px';
                    dictBox.style.top = e.clientY + 20 + 'px';
                    dictBox.style.display = 'block';
                    setTimeout(function() { dictBox.classList.add('show-dictBox'); }, 0)
                    isBoxOpened = true;
                    lookup(selectWord);
                    //window.getSelection().collapseToStart();
                    //clear selection area
                }
            } else {
                if (selectWord != '') {
                    lookup(selectWord);
                } else {
                    if (e.target.nodeName == 'DICTBOXBAR' || e.target.nodeName == 'IMG' || isPinned) {
                        return false;
                    }
                    dictBox.classList.remove('show-dictBox');
                    hiddenProcess = setTimeout(function() {
                        dictBox.style.display = 'none';
                    }, 800);
                    hiddenProcessDetectProcess = setInterval(function() {
                        if (isBoxOpened) {
                            clearTimeout(hiddenProcess);
                            clearInterval(hiddenProcessDetectProcess);
                        }
                    }, 16)
                    isBoxOpened = false;
                }
            }

        }

    })

    pinOnTop.addEventListener('click', function(e) {
        if (isPinned) {
            pinOnTop.classList.remove('pinned');
            isPinned = false;
        } else {
            pinOnTop.classList.add('pinned');
            isPinned = true;
        }
    })

    function lookup(w) {
        if (location.protocol == 'https:') {
            injectedResultBox.src = 'https://youdao.com/w/eng/' + w;
        } else {
            injectedResultBox.src = 'http://dict.cn/' + w;
        }
        setTimeout(setHeight,1000)
    }

    function setHeight(){

        chrome.runtime.sendMessage({ get: "height" }, function(response) {
            console.log('[INJECTED] get from background: ' + isDragSearch)

            var h = response.param;
            if (h == 52) {
                injectedResultBox.height = 100;
                injectedResultBox.src = '404.html'
            } else {
                injectedResultBox.height = h;
            }
            console.log("[Injected]: get dynamic word area height succussful": + h)

        });


    }

}
