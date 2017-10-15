/*jslint browser: true, indent: 2 */
/*global '$', window */

var lastWindowHeight;

/* ISSUES:
  IE will not allow divs to be sized smaller than their content.
  Other browsers spill div content over the bottom when it is too small.

  None of the browsers treat 100% of height as the height of the usable areas.
  Maybe they include the height of the menus and toolbars.

  Should you use absolute positioning instead of floats?
*/
function layout() {
  var centerHeight, windowHeight;

  //windowHeight = $(window).height();
  windowHeight = $('#outer').height();
  if (windowHeight !== lastWindowHeight) {
    //alert('windowHeight = ' + windowHeight);

    centerHeight =
      windowHeight - 100 - $('#header').height() - $('#footer').height();
    //alert('centerHeight = ' + centerHeight);

    $('#left').css('height', centerHeight);
    $('#center').css('height', centerHeight);
    $('#right').css('height', centerHeight);

    // It appears that the width of #center needed to recalculated
    // and explicitly set in Safari and Chrome.

    lastWindowHeight = windowHeight;
  }
}

$(document).ready(function () {
  layout();
  $(window).resize(layout);
});
