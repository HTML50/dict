if (location.href.indexOf('dict.cn') == -1 && location.href.indexOf('youdao.com') == -1) {
  init();
}

function init() {

  var isDragSearch, isCtrlSearch;

  //get isDragSearch from background when injected
  chrome.runtime.sendMessage({ get: "isDragSearch" }, function(response) {
    isDragSearch = response.param;
    console.log('[INJECTED] get isDragSearch from background: ' + isDragSearch)
  });

  chrome.runtime.sendMessage({ get: "isCtrlSearch" }, function(response) {
    isCtrlSearch = response.param;
    console.log('[INJECTED] get isCtrlSearch from background: ' + isCtrlSearch)
  });



  //get isDragSearch from popup window when the value is changed
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.dragSearchStatusChange != undefined) {
        isDragSearch = request.dragSearchStatusChange;
        console.log("enable dragSearch: " + isDragSearch)
        sendResponse({ param: "Injected: enable dragSearch: " + isDragSearch });
      }
      if (request.ctrlSearchStatusChange != undefined) {
        isCtrlSearch = request.ctrlSearchStatusChange;
        console.log("enable ctrlSearch: " + isCtrlSearch)
        sendResponse({ param: "Injected: enable ctrlSearch: " + isCtrlSearch });
      }

    });



  //injected window
  var injectedHTML = document.createElement("DIV");
  injectedHTML.innerHTML = '<dictBox id="dictBox" class="dict-box transiton-in">\
  <dictBoxBar id="dictBoxBar" class="no-select">\
  <img id="pinIt" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3QUQAAQwuDiIFgAAAxVJREFUWMPF1ktoXFUcx/HPnTszycxkUqpCVKhgxU2pxUexWHfSnYvSjSAqPmt1ITWWuvRRV1qkoIiLCKIbUVA3KvW5UjD4QtAsrIq0UVMJpmKbmMfc62LuDDe3k5vbSao/OHDvef2+5/E/5/A/K1hrBx9NPNozf9eWZwq1L62TeYAt2IHBPLB1BUgUYj8+TNKTqBeFWA+AnXgMl6KJA+cC0TdAKexun63YmJmR0aIQfQNErbjz+QG+yBQXhliPJfgJ9+HrfiByw7BXg054Zco2YyyO45uC4KwuWziCxzGb7iMXIGNQQpykbP6epPOrFuaXBEGgUg0LQ/QESJnXE4ObcRrP4buk7GLtHX8/hiGKYn+fmlNrVFUHyoUgylZWqB1eB+jWuzYx3ICncOOy6SgFqoMVf83M2nBBXbVazvY3mnx3IfI2YQufYiqVdx3ewGtZ845q9YqwHJqZPmNhYanXoB7GLek1zNM72IcTqbwrMJLXqDk8KGrFZqbPzLWWoqlMcRmbcgEyF8l7eCADkatKNdRoDlicb43FcbwHX6WKJ7XPjvwZWCvEUHNgvD5UPby0GH2Oe/E63sSdGC+0BMviNWhDBIFfClzip0ph6VCtUZ38fXIGvsUduBWfpCuGq/X06gufuXLzNpPHFty1+9iP1+9obmsMh9dUB3IpnsZLlUpo44WNTl6UpGWDW3Usowf3pmdrfxx7YmRTZXjrzrraUOnso4n3cTums7PYS7lLkDXHoSAwfPLEoonx2amo5WSmyRJe6ZgX0YoAvcwxBEHg+G8/L9xdKrnH8o1ZxiO4ek0AeeY4jn21ofDo/D9xr+jYjmdxUV8ARcxxdO50pNYI6B2i23H5OQMUNYdSSNTqNs1CfK/9TigOkDKnfeGsaA5HDo/1OqwexASex599LQF2ab9ics27lZdDvIvdeKuIOck5kBr9CN7GDcn/D3hI6uxOm6eV93rKU/Y9sDdl/jEO4pvVzIuarQZwGW7Dr3gRY/ijiPlalAa4BC9rvwEm0pXOl3kW4Eupa/J8G/cC6Eb1f2Hc0b/FhAOhNRRq5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxOTowMyswODowMOVzP7kAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMDUtMTZUMDA6MDQ6NDgrMDg6MDCjG60mAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADI1NunDRBkAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMjU2ejIURAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzY4NjMzODg49kUYbQAAABJ0RVh0VGh1bWI6OlNpemUAMy4zOEtCjlYEugAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTExMzQvMTExMzQ1MC5wbmfyvQGEAAAAAElFTkSuQmCC" title="置顶" draggable="false" class="not-pinned  no-border">\
  <img id="closeIt" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAlgAAAJYAJvGvrMAAAAHdElNRQfeBgoKJRmFEj/KAAAAuElEQVQoz2XRsW7CMBRA0dOWRGn/uK2EggCJKmxsHRn7b9kiCKSRO1hJY+Px3SvL148fnaNKft6cdM50gl6tTHDl4C5oOeoFN5uF8urLILjYUandEmXCvY84KW1mpVDN+FMxXfmv7DWPeKmMRsE1x1DYGwXBYG01jZ9n4WWueFIs5lnY4PcheoGv1rZZNEnYKoku458f5m8psuhaxck9wUul18RlXbxn3aVaH5d11tplu4wva7S+/wAYyWlkkqIbxgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToyMTowMyswODowMG9GGUwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDYtMTBUMTA6Mzc6MjUrMDg6MDB+ZygYAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIHILdZYAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADI4NcVka+4AAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMjg1VpU7swAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNDAyMzY3ODQ1NXCZSAAAABJ0RVh0VGh1bWI6OlNpemUAMi45N0tCIetwRgAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTE3MDQvMTE3MDQxMy5wbmeNgrYCAAAAAElFTkSuQmCC" title="关闭" draggable="false" class="close  no-border">\
  </dictBoxBar>\
  <iframe id="injectedResultBox" scrolling="no"></iframe>\
  </dictBox>';
  document.body.insertBefore(injectedHTML, document.body.childNodes[0]);

  var isMouseDown,
    isCtrlDown,
    initX, initY,
    dictBoxBar = document.getElementById('dictBoxBar'),
    isBoxOpened = false,
    isPinned = false,
    hiddenProcess, hiddenProcessDetectProcess;

  dictBoxBar.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    document.body.classList.add('no-select');
    injectedResultBox.classList.add('pointer-events')
    initX = e.offsetX;
    initY = e.offsetY;
    dictBox.style.opacity = 0.5;
  })

  dictBoxBar.addEventListener('mouseup', function(e) {
    mouseupHandler();
  })
  document.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
      var cx = e.clientX - initX,
        cy = e.clientY - initY;
      if (cx < 0) {
        cx = 0;
      }
      if (cy < 0) {
        cy = 0;
      }
      if (window.innerWidth - e.clientX + initX < injectedResultBox.offsetWidth - 16) {
        cx = window.innerWidth - injectedResultBox.offsetWidth - 16;
      }
      if (e.clientY > window.innerHeight - dictBoxBar.offsetHeight - injectedResultBox.offsetHeight + initY) {
        cy = window.innerHeight - injectedResultBox.offsetHeight - dictBoxBar.offsetHeight;
      }
      dictBox.style.left = cx + 'px';
      dictBox.style.top = cy + 'px';
    }
  })

  document.addEventListener('mouseup', function(e) {
    if (e.clientY > window.innerWidth || e.clientY < 0 || e.clientX < 0 || e.clientX > window.innerHeight) {
      mouseupHandler();
    }
    var selectWord = getSelection().toString().trim();
    if (!isBoxOpened) {
      if (selectWord != '' && isDragSearch) {
        if (isCtrlSearch) {
          if (!isCtrlDown) {
            return false;
          }
        }
        var rsTop = e.clientY + 20,
          rsLeft = e.clientX + 20;

        if (window.innerHeight - e.clientY < 400) {
          rsTop = 0;
        }
        if (window.innerWidth - e.clientX < 330) {
          rsLeft = 0;
        }
        dictBox.style.left = rsLeft + 'px';
        dictBox.style.top = rsTop + 'px';
        dictBox.style.display = 'block';
        setTimeout(function() { dictBox.classList.add('show-dictBox'); }, 0)
        isBoxOpened = true;
        lookup(selectWord);
      }
    } else {
      if (selectWord != '' && isDragSearch && e.target.nodeName != 'DICTBOXBAR' && e.target.nodeName != 'IMG') {
        lookup(selectWord);
      } else {
        if (e.target.nodeName == 'DICTBOXBAR' || e.target.nodeName == 'IMG' || isPinned) {
          return false;
        }
        close();
      }
    }
  })

  document.addEventListener('keydown', function(e) {
    if (e.keyCode == '27' && !isPinned && isBoxOpened) {
      close()
    }

    if (e.keyCode == 17) {
      isCtrlDown = true;
    }
  })

  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 17) {
      isCtrlDown = false;
    }
  })


  closeIt.addEventListener('mousedown', function(e) {
    close();
  });



  pinIt.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    if (isPinned) {
      pinIt.classList.remove('pinned');
      isPinned = false;
    } else {
      pinIt.classList.add('pinned');
      isPinned = true;
    }
  })

  function mouseupHandler() {
    isMouseDown = false;
    document.body.classList.remove('no-select');
    injectedResultBox.classList.remove('pointer-events');
    dictBox.style.opacity = 1;
  }



  function lookup(w) {
    if (location.protocol == 'https:') {
      injectedResultBox.src = 'https://youdao.com/w/eng/' + w;
    } else {
      injectedResultBox.src = 'http://dict.cn/' + w;
    }

    injectedResultBox.onload = setHeight;
  }

  function close() {
    dictBox.classList.remove('show-dictBox');
    hiddenProcess = setTimeout(function() {
      dictBox.style.display = 'none';
    }, 300);
    hiddenProcessDetectProcess = setInterval(function() {
      if (isBoxOpened) {
        clearTimeout(hiddenProcess);
        clearInterval(hiddenProcessDetectProcess);
      }
    }, 16)
    window.getSelection().collapseToStart();
    //clear selection area
    isBoxOpened = false;
  }

  function setHeight() {

    chrome.runtime.sendMessage({ get: "height" }, function(response) {

      var h = response.param;
      if (h == 52 && injectedResultBox.src.indexOf('404') == -1) {
        var checkURL = chrome.runtime.getURL('404.html');
        injectedResultBox.src = checkURL;
        injectedResultBox.style.height = 120 + 'px';
        injectedResultBox.onload = null;
      } else {
        injectedResultBox.style.height = h + 'px';
      }
      console.log("[INJECTED]: get dynamic word-area height succussful: " + h);

    });


  }

}
