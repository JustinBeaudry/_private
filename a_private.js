(function(window, document){
  'use strict';
  
  var NAME = '[_private]',
    options = {};
    
  chrome.storage.local.get('type', function(data) {
    options.type = data || null;
  });
  chrome.storage.local.get('focus', function(data) {
    options.focus = data || null;
  });
  chrome.storage.local.get('verbose', function(data) {
    options.verbose = data || null;
  });
  
  function open_incognito(opts) {
    if (!opts) {
      throw new Error(NAME + ' open_incognito requires an options object');
    }

    var url = opts.url || {},
      type = opts.type || "popup",
      focus = opts.focus || true;

    if ((typeof url === String || typeof url === Array) === false) {
      throw new Error(NAME + 'window.openIncognito requires a string or an array of urls');
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

  var a_elements = document.getElementsByTagName('a');

  for (var i = 0; i < a_elements.length; i += 1) {

    var element = a_elements[i],
      target = element.getAttribute('target'),
      href = element.getAttribute('href');

    if (target && target === '_private') {

      element.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        window.openIncognito(href, (options.type || null), (options.focus || null));

      }, false);
    }
  }

  /*
   *  Settings window
   */
  var settings = {
    type: document.getElmentById('type'),
    focus: document.getElmentById('focus'),
    verbose: document.getElmentById('verbose'),
    save: document.getElmentById('save')
  }, changed = false;

  function updateChanged() { 
    changed = !changed; 
    if (changed) {
      settings.save.setAttribute('disabled', '');
      settings.save.classList.add('disabled');
    }
    else {
      settings.save.removeAttribute('disabled');
    }
  }

  settings.save.addEventListener('click', function(event) {
    var type = settings.type.value,
      focus = settings.focus.value,
      verbose = settings.verbose.value;
   
    if (type) {
      chrome.storage.local.set({'type': type});
    }
    if (focus) {
      chrome.storage.local.set({'focus': focus});
    }
    if (verbose) {
      chrome.storage.local.set({'verbose': verbose});
    }
    
  }, false);

  settings.type.addEventListener('change', updateChanged, false);
  settings.focus.addEventListener('change', updateChanged, false);
  settings.verbose.addEventListener('change', updateChanged, false);



}(window, document));
