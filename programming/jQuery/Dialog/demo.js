/*jslint indent: 2 */
/*global $: true, alert: true, console: true, document: true */

function createAccount() {
  var msg, username = $('#username').val();
  if (username) {
    $('#username').removeClass('invalid');
    msg = '';
    $(this).dialog('close');
    alert('created a new account for ' + username);
  } else {
    $('#username').addClass('invalid');
    msg = 'Required field username is empty.';
  }
  $('#message').text(msg);
}

$(document).ready(function () {
  var newDialog = $('#newDialog').dialog({
    autoOpen: false,
    buttons: {
      'OK': createAccount,
      'Cancel': function () {
        $(this).dialog('close');
      }
    },
    hide: 'explode',
    modal: true,
    resizable: false,
    show: 'slide',
    width: 320
  });

  $('#newButton').button().click(function () {
    newDialog.dialog('open');
  });
});
