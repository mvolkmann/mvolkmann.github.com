/*jslint indent: 2 */
/*global $: true, clearInterval: true, document: true, setInterval: true */

var token;

function updateProgress() {
  var pb = $('#progress'),
      value = pb.progressbar('value') + 1;
  if (value <= 100) {
    pb.progressbar('value', value);
    $('#value').text(value + '%');
  } else {
    clearInterval(token);
  }
}

$(document).ready(function () {
  $('#progress').progressbar({
    value: 19
  });
  token = setInterval(updateProgress, 50); // milliseconds
});
