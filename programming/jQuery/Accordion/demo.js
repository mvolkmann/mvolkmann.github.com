/*jslint indent: 2 */
/*global $: true, document: true */

$(document).ready(function () {
  $('#meals').accordion({
    active: 1, // Lunch
    animated: 'bounceslide',
    autoHeight: false,
    event: 'mouseover'
  });
});
