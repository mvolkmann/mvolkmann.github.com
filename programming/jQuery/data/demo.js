$(document).ready(function () {
  var firstDiv = $('div:eq(0)');
  firstDiv.data('number', 99);
  $('body').append('<div>Number ' + firstDiv.data('number') + '</div>');
});
