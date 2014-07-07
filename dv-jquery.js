(function ($) {

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

})(jQuery);
