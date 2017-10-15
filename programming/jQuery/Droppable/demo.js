/*jslint browser: true, indent: 2 */
/*global $: true */

function positionDroppables() {
  $('#foodTarget').position({
    my: 'right top', at: 'right top', of: '#container'
  });

  $('#sportTarget').position({
    my: 'right bottom', at: 'right bottom', of: '#container'
  });
}

function drop(evt, ui) {
  var draggable, droppable, text;
  draggable = $(ui.draggable);
  droppable = $(this);
  text = draggable.text();

  droppable.html(droppable.html() + '<br/>' + text);
  draggable.hide();
  positionDroppables(); // because their content changed

  //draggable.position({
  //  my: 'center', at: 'center', of: droppable
  //});
}

$(document).ready(function () {
  var options;

  $('.food, .sport').addClass('item');

  options = {
    containment: 'parent',
    cursor: 'pointer',
    revert: 'invalid', // return to original location if not dropped on an acceptable Droppable
    stack: '.item'
  };
  $('.food, .sport').draggable(options);

  positionDroppables();

  $('.bucket').droppable({
    activeClass: 'compatibleTarget',
    drop: drop,
    hoverClass: 'overTarget',
    tolerance: 'fit'
  });

  $('#foodTarget').droppable('option', 'accept', '.food');
  $('#sportTarget').droppable('option', 'accept', '.sport');
});
