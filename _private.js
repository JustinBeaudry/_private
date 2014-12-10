(function(window, document){
  'use strict';
  
  var NAME = '[_private]';
  var options = chrome.storage.local.get('_private:settings') || {};

  function open_incognito(opts) {
    if (!opts) {
      throw new Error(NAME + ' open_incognito requires an options object');
    }

    var url = opts.url || {};
    var type = opts.type || "popup";
    var focus = opts.focus || true;

    if ((typeof url === String || typeof url === Array) === false) {
      throw new Error('window.openIncognito requires a string or an array of urls');
    }
    if (options.verbose) {
      console.info(NAME + ' Opening Incognito Window');
    }

    chrome.windows.create({
      url: url,
      focus: focus,
      type: type,
      incognito: true
    });
  }

  if (!window.openIncognito) {
    window.openIncognito = function open_incognito_window(url, type, focus) {

      var opts = {
        url: url,
        type: type,
        focus: focus
      };

      open_incognito(opts);
    };
  }

  var a_elements = document.body.getElementsByTagName('a');

  for (var i = 0; i < a_elements.length; i += 1) {

    var element = a_elements[i];
    var target = element.attributes.getNamedItem('target');
    var href = element.attributes.getNamedItem('href');

    if (target && target._private) {

      target.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        window.openIncognito(href, (options.type || null), (options.focus || null));

      }, false);
    }
  }

  var settings = {
    type: document.getElmentById('type'),
    focus: document.getElmentById('focus'),
    verbose: document.getElmentById('verbose')
  };

}(window, document));
