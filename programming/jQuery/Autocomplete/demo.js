/*jslint browser: true, indent: 2 */
/*global $: true */

function getArtists(req, callback) {
  $.ajax({
    url: 'http://localhost:3000',
    dataType: 'jsonp',
    data: {
      term: req.term
    },
    success: callback
  });
}

$(document).ready(function () {
  var sports = [
    'Baseball', 'Basketball', 'Cycling', 'Football',
    'Golf', 'Hockey', 'Tennis', 'Running', 'Swimming'
  ];
  $("#sportField").autocomplete({
    source: sports
  });

  $("#artistField").autocomplete({
    source: getArtists
  });
});
