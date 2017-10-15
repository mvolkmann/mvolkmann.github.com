/*jslint indent: 2 */
/*global $: true, console: true, document: true */

function updateValue() {
  var minDiv = $('#minValue'),
      maxDiv = $('#maxValue'),
      handles = $('#slider .ui-slider-handle'),
      handle1 = handles.eq(0),
      handle2 = handles.eq(1),
      offset1 = handle1.offset(),
      offset2 = handle2.offset(),
      values = $('#slider').slider('values');

  minDiv.text(values[0]);
  maxDiv.text(values[1]);

  minDiv.css({
    left: offset1.left,
    top: offset1.top + handle1.height() + 5
  });

  maxDiv.css({
    left: offset2.left,
    top: offset2.top + handle2.height() + 5
  });
}

$(document).ready(function () {
  $('#slider').slider({
    change: updateValue,
    max: 110,
    min: -10,
    range: true,
    slide: updateValue,
    step: 5,
    values: [65, 85]
  });
  updateValue(); // to display initial values
});
