function addCD(artist, cd) {
  var table = $('#newMusic');
  var tr = $('<tr><td>' + artist + '</td><td>' + cd + '</td></tr>');
  /*
  var tr = $('<tr>');
  var td = $('<td>');
  td.text(artist);
  tr.append(td);
  td = $('<td>');
  td.text(cd);
  tr.append(td);
  */
  table.append(tr);
}

$(document).ready(function () {
  addCD('The Arcade Fire', 'The Suburbs');
  addCD('Joanna Newsom', 'Have One On Me');

  //$('#newMusic' tr td:eq(0)).css('color', 'red');
  $('#newMusic tr').each(function () {
    var firstTD = $(this).children('td:eq(0)');
    //firstTD.wrap($('<button>'));
  });

  $('button').click(function () {
    alert('You pressed ' + $(this).text());
  });
});
