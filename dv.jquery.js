/*
 * dv.jquery.js v0.2.0
 *
 * Copyright 2014-2015 by Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT license
 *
 * Date: Oct 23, 2015
 */

(function (dv, $) {

  if (!$) return;

  $.fn.dvHtml = function (dv) {
    var el = this;
    dv.onChange(function (v) { el.html(v); });
    el.html(dv.value);
    return el;
  }

  $.fn.dvVal = function (dv) {
    var el = this;
    el.on("input", function () { dv.value = el.val(); });
    dv.onChange(function (v) { el.val(v); });
    el.val(dv.value);
    return el;
  };

})(window.dv, window.jQuery);
