/*
 * dv.jquery.js v0.1
 *
 * Copyright 2014 by Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT license
 *
 * Date: Sun Jul 6, 2014
 */

(function (dv, $) {

  if (!$) return;

  $.fn.dvHtml = function (dv) {
    var el = this;
    dv.onchange(function (v) { el.html(v); });
    el.html(dv.value);
    return el;
  }

  $.fn.dvVal = function (dv) {
    var el = this;
    el.on("input", function () { dv.value = el.val(); });
    dv.onchange(function (v) { el.val(v); });
    el.val(dv.value);
    return el;
  };

})(window.dv, window.jQuery);