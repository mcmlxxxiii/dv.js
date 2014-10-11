function objSize(obj) {
  var size = 0;
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) { size += 1; }
  }
  return size;
}

function args(args) {
  return Array.prototype.slice.call(args);
}
