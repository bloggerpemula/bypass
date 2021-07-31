exports.totalBytes = function(string) {
  return encodeURI(string).split(/%..|./).length - 1;
}