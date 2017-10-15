/*jslint browser: true, indent: 2 */
/*global $: true */

function lookup() {
  var queryString, url;
  queryString = $('form').serialize();
  url = 'http://ws.geonames.org/postalCodeLookupJSON?' + queryString;
  $.getJSON(url, function (data, textStatus) {
    var found = false;
    $.each(data.postalcodes, function (index, value) {
      if (value.countryCode === 'US') {
        $('#city').text(value.placeName);
        $('#state').text(value.adminName1);
        found = true;
      }
    });
    if (!found) {
      $('#city').text('No match found');
      $('#state').text('');
    }
  });
}

$(document).ready(function () {
  $('#lookup').click(lookup);
});
