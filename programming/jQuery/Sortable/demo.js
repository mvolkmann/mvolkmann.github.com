/*jslint browser: true, indent: 2 */
/*global $: true */

$(document).ready(function () {
  $('#container').sortable({
    axis: 'y',
    containment: '#container',
    cursor: 'pointer'
  });
});
