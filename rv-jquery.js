$.fn.rvHtml = function (rv) {
  var el = this;
  rv.onchange(function (v) { el.html(v); });
  el.html(rv.value);
  return el;
}

$.fn.rvVal = function (rv) {
  var el = this;
  el.on("input", function () { rv.value = el.val(); });
  rv.onchange(function (v) { el.val(v); });
  el.val(rv.value);
  return el;
};
