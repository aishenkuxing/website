;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-massage" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M916.736 148.224 107.264 148.224c-59.136 0-107.264 48.128-107.264 107.264l0 513.28c0 59.136 48.128 107.264 107.264 107.264l809.472 0c59.136 0 107.264-48.128 107.264-107.264L1024 255.488C1024 196.352 975.872 148.224 916.736 148.224zM658.688 497.664l317.184-262.144c0.768 3.328 1.024 6.656 1.024 10.24l0 532.992c0 5.632-1.024 10.752-2.816 15.872L658.688 497.664zM924.928 193.792c8.448 0 16.384 2.304 23.552 5.888L512 560.896 78.08 198.144c6.4-2.816 13.312-4.352 20.736-4.352L924.928 193.792zM49.92 794.624c-1.536-5.12-2.816-10.24-2.816-15.872L47.104 245.504c0-4.608 0.768-8.96 1.792-13.056l317.696 264.96L49.92 794.624zM99.072 830.72c-5.632 0-11.264-1.28-16.384-2.816l320-300.032 109.312 91.136 110.592-91.392 318.976 300.032c-5.12 1.792-10.752 3.072-16.64 3.072L99.072 830.72z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-person" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M451.584 567.296c103.168 0 186.624-88.832 186.624-198.4 0-109.568-83.456-198.4-186.624-198.4-102.912 0-186.624 88.832-186.624 198.4C265.216 478.464 348.672 567.296 451.584 567.296z"  ></path>' +
    '' +
    '<path d="M731.904 273.408l214.272 0c5.632 0 10.24-4.608 10.24-10.24l0-51.712c0-5.632-4.608-10.24-10.24-10.24l-214.272 0c-5.632 0-10.24 4.608-10.24 10.24l0 51.712C721.664 268.8 726.272 273.408 731.904 273.408z"  ></path>' +
    '' +
    '<path d="M731.904 416.256l248.32 0c5.632 0 10.24-4.608 10.24-10.24l0-51.712c0-5.632-4.608-10.24-10.24-10.24l-248.32 0c-5.632 0-10.24 4.608-10.24 10.24l0 51.712C721.664 411.648 726.272 416.256 731.904 416.256z"  ></path>' +
    '' +
    '<path d="M1013.76 487.168 731.904 487.168c-5.632 0-10.24 4.608-10.24 10.24l0 51.712c0 5.632 4.608 10.24 10.24 10.24L1013.76 559.36c5.632 0 10.24-4.608 10.24-10.24l0-51.712C1024 491.776 1019.392 487.168 1013.76 487.168z"  ></path>' +
    '' +
    '<path d="M454.656 608.512c-315.392 0-374.528 191.488-374.528 191.488-1.536 17.664-2.56 35.584-3.328 53.76l749.824 0c-0.768-17.92-2.048-35.84-3.328-53.76C823.04 800 770.048 608.512 454.656 608.512z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-right" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M302.848 1024 209.152 930.56 627.712 512 209.152 93.696 302.848 0 814.848 512Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-setnumber" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M845.312 399.36l-51.2 0 0-117.248c0-155.648-126.464-282.112-282.112-282.112-155.648 0-282.112 126.464-282.112 282.112l0 117.248-51.2 0c-32 0-57.856 25.856-57.856 57.856l0 508.928c0 32 25.856 57.856 57.856 57.856l666.624 0c32 0 57.856-25.856 57.856-57.856L903.168 457.216C903.168 425.216 877.312 399.36 845.312 399.36zM317.952 282.112c0-107.008 87.04-194.048 194.048-194.048 107.008 0 194.048 87.04 194.048 194.048l0 117.248L317.952 399.36 317.952 282.112zM609.28 901.12l-194.56 0 43.008-190.976c-28.416-17.92-47.616-49.664-47.616-85.76 0-56.32 45.568-101.888 101.888-101.888s101.632 45.568 101.632 101.888c0 36.096-18.944 67.84-47.616 85.76L609.28 901.12z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)