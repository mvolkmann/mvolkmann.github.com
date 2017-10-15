/*
$(document).ready(function () {
  $('.color').each(function () {
    var colorDiv = $(this);
    colorDiv.nextAll().each(function () {
      var flavorDiv = $(this);
      if (flavorDiv.text().match(/a/)) flavorDiv.css('color', 'blue');
    });
  });
});
*/

function go() {
  /*
  $('h1').css({
    backgroundColor: 'yellow',
    color: 'red',
    fontSize: '24pt'
  });
  */
  $('.color').each(processColor);
}

function processColor() { $(this).nextAll().each(processFlavor); }

function processFlavor() {
  var flavorDiv = $(this);
  if (flavorDiv.text().match(/a/)) flavorDiv.css('color', 'blue');
}

$(document).ready(go);
