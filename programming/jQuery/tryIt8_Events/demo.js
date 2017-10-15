/*jslint browser: true, indent: 2 */
/*global $: true */

var addButton, artistField, cdField;

function addCD() {
  var tr = $('<tr><td>' + artistField.val() +
    '</td><td>' + cdField.val() + '</td></tr>');
  $('#music').append(tr);
}

function evaluateChange() {
  var disable = !artistField.val() || !cdField.val();
  addButton.attr('disabled', disable);
}

$(document).ready(function () {
  addButton = $('#add');
  artistField = $('#artist');
  cdField = $('#cd');

  addButton.attr('disabled', true);
  artistField.change(evaluateChange);
  cdField.change(evaluateChange);
  addButton.click(addCD);

  $('#music tr td:first-child').live('mouseenter', function () {
    artistField.val($(this).text());
  });

  $('#music tr td:last-child').live('mouseenter', function () {
    cdField.val($(this).text());
  });
});
