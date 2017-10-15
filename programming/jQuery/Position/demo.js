/*jslint browser: true, indent: 2 */
/*global $: true */

$(document).ready(function () {
  var offset = 5;

  $('#center').position({
    my: 'center', at: 'center', of: '#outer'
  });

  $('#top').position({
    my: 'bottom', at: 'top', of: '#center',
    offset: '0 ' + -offset
  });

  $('#right').position({
    my: 'left', at: 'right', of: '#center',
    offset: offset + ' 0'
  });

  $('#bottom').position({
    my: 'top', at: 'bottom', of: '#center',
    offset: '0 ' + offset
  });

  $('#left').position({
    my: 'right', at: 'left', of: '#center',
    offset: '-' + offset + ' 0'
  });
});
