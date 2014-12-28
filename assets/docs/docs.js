(function () {
  'use strict';
  var doc = document.getElementById('doc')
  var images = {}
  doc.onclick = function(e) {
    var target = e ? e.target : window.event.srcElement;
    if (target.tagName == 'IMG') {
      images[target.src] = target
      var width = target.style.maxWidth == '70%' ? '' : '70%'
      target.style.maxWidth = width;
    }
  }

  document.onkeydown = function(e) {
    e = (e || event);
    if ((e.keyCode || e.which) == 27) {
      for (var k in images) {
        images[k].style.maxWidth = '';
      }
    }
  };

  //cheat
  var img = document.createElement('img');
  img.src = 'https://sandbox.teapi.io/v1/companies?sort=-funding&key=4800mh74u41s&callback=techstars_callback';
})();
