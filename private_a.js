(function(window, document){
  'use strict';
  
  var NAME = '[_private]',
    options = {};
 
  /*
   *  Wrapper for chrome.windows.create(), configured for opening Incognito windows
   */
  function open_incognito(opts) {
    if (!opts) {
      throw new Error(NAME + ' open_incognito requires an options object');
    }

    var url = opts.url || {},
      type = opts.type || "popup",
      focus = opts.focus || true;
    
    if ((typeof url === String || typeof url === Array) === true) {
      throw new Error(NAME + ' window.openIncognito requires a string or an array of urls');
    }
    if (options.verbose) {
      console.info(NAME + ' Opening Incognito Window');
    }

    chrome.windows.create({
      url: url,
      focused: focus,
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

  window.onload = function onWindowLoad() {
    /*
     *  Get Extension Settings from Chrome Storage Local
     */
    chrome.storage.local.get('enabled', function(data) {
      options.enabled = data || true;
    });
    chrome.storage.local.get('type', function(data) {
      options.type = data || null;
    });
    chrome.storage.local.get('focus', function(data) {
      options.focus = data || null;
    });
    chrome.storage.local.get('verbose', function(data) {
      options.verbose = data || null;
    });

    /*
     *  Get all <a>'s from users page
     */
    var a_elements = document.getElementsByTagName('a');

    for (var i = 0; i < a_elements.length; i += 1) {

      var element = a_elements[i],
        target = element.getAttribute('target'),
        href = element.getAttribute('href');

      console.log(element, target, href);
      if (target && target === '_private') {

        element.addEventListener('click', function(event) {
          event.stopPropagation();
          event.preventDefault();

          window.openIncognito(href, (options.type || null), (options.focus || null));

        }, false);
      }
    }

    //=====================================================
    
    /*
     *  Settings window
     */
    var enabled = document.getElementById('enabled'),
      type = document.getElementById('type'),
      focus = document.getElementById('focus'),
      verbose = document.getElementById('verbose'),
      save = document.getElementById('save'),
      changed = false;

    function updateChanged(event) {
      changed = !changed;
      console.info('Setting Changed!', event);
      save.classList.toggle('pure-button-disabled');
    }

    save.addEventListener('click', function(event) {
      if (enabled.value) {
        chrome.storage.local.set({'enabled': enabled.value});
      }
      if (type.value) {
        chrome.storage.local.set({'type': type.value});
      }
      if (focus.value) {
        chrome.storage.local.set({'focus': focus.value});
      }
      if (verbose.value) {
        chrome.storage.local.set({'verbose': verbose.value});
      }
      
    }, false);

    enabled.addEventListener('change', updateChanged, false);
    type.addEventListener('change', updateChanged, false);
    focus.addEventListener('change', updateChanged, false);
    verbose.addEventListener('change', updateChanged, false);
    
  }
}(window, document));
