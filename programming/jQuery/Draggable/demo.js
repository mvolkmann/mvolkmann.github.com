/*jslint browser: true, indent: 2 */
/*global $: true */

function dump(obj) {
  for (prop in obj) console.log(prop + ' = ' + obj[prop]);
}

$(document).ready(function () {
  $('.box').draggable({ // adds class "ui-draggable"
    containment: 'parent',
    //containment: [200, 200, 600, 400],
    cursor: 'pointer',
    //grid: [20, 20],
    opacity: 0.5,
    snap: true,
    snapTolerance: 10,
    stack: '.box',
    start: function (evt) {
      //dump(evt);
      $('#status').text('Drag of "' + $(evt.target).text() + '" started');
    },
    drag: function (evt, ui) {
      //dump(evt);
      $('#status').text('Drag of "' + $(evt.target).text() +
        '" at ' + ui.position.left + ', ' + ui.position.top.toFixed(0));
    },
    stop: function (evt) {
      $('#status').text('Drag of "' + $(evt.target).text() + '" stopped');
    }
  });

  //$('.box').draggable('option', 'cancel', '#right');
  $('#right').draggable('option', 'cancel', '*');
});
