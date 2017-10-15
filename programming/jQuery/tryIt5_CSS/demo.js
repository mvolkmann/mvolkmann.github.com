$(document).ready(function () {
  $('.color').each(function () {
    var colorDiv = $(this);
    colorDiv.nextAll().each(function () {
      var flavorDiv = $(this);
      if (flavorDiv.text().match(/a/)) flavorDiv.addClass('highlight');
    });
  });
});
