(function () {
  'use strict';
  function Viewer(container, config) {
    var self = this;
    this.config = config;
    this.result = append(container, $$('pre', {'class': 'result'}));
    this.types = new Type(config.types, function() { self.reload(); });
    this.callback = container.getAttribute('data-key') + '_callback';
    window[this.callback] = function(data) {
      text(self.result, JSON.stringify(data, null, 2));
      document.body.removeChild(self.script);
    };
    document.onkeydown = function(e) {
      e = (e || event);
      if ((e.keyCode || e.which) == 27) { self.minimize(); }
    }
    document.onclick = function() {
      self.minimize();
    }

    container.appendChild(this.types.node);
    this.reload();
  };

  Viewer.prototype.reload = function() {
    var url = this.config.baseUrl || 'https://beta.teapi.io/v1/';
    url += this.types.value
    url +=  '?callback=' + this.callback + '&key=' + this.config.key
    this.script = document.body.appendChild($$('script', {src: url, type: 'text/javascript'}));
  };

  Viewer.prototype.minimize = function() {
    this.types.minimize();
  };

  function Type(types, onChanged) {
    var self = this;
    var currentNode = $$('li')
    var node = $$('ul', {'class': 'types'});
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      var option = $$('li', {'data-name': type.name});
      text(option, type.name);
      node.appendChild(option);
      if (type.auto) {
        this.value = type.name;
        text(currentNode, type.name);
      }
    }
    node.appendChild(currentNode)
    if (types.length > 1) {
      node.className += ' many';
      node.onclick = function(e) { self.clicked(e); }
    }
    this.node = node;
    this.config = config;
    this.onChanged = onChanged;
    this.currentNode = currentNode;
  };

  Type.prototype.clicked = function(e) {
    cancelBubble(e || window.event);
    if (toggleClass(this.node, 'show')) {
      return false;
    }
    var target = e ? e.target : window.event.srcElement;
    if (target.tagName == 'LI') {
      var name = target.getAttribute('data-name');
      if (name && name != this.value) {
        this.value = name;
        text(this.currentNode, name);
        this.onChanged();
      }
    }
    return false;
  };


  Type.prototype.minimize = function() {
    removeClass(this.node, 'show');
  };

  function $$(tag, attributes) {
    var e = document.createElement(tag);
    for (var k in attributes) {
      e.setAttribute(k, attributes[k]);
    }
    return e
  };

  function append(container, node) {
    container.appendChild(node);
    return node;
  };

  function text(node, text) {
    if ('textContent' in document.body) {
      node.textContent = text;
    } else {
      node.innerText = text;
    }
  };

  function toggleClass(node, className) {
    var l = node.className.length;
    if (l == 0) {
      node.className = className;
      return true;
    }
    removeClass(node, className);
    if (node.className.length == l) {
      node.className += ' ' + className;
      return true;
    }
    return false;
  };

  function removeClass(node, className) {
    node.className = node.className.replace(new RegExp('\\b' + className + '\\b'), '');
  };

  function cancelBubble(e) {
     if (e.stopPropagation) { e.stopPropagation(); }
     if (e.cancelBubble != null) { e.cancelBubble = true; }
  };

  window.TeapiViewer = Viewer;
})();
