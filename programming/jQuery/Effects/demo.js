$(document).ready(function () {
  $('#doIt').click(function () {
    var buttonText, effectName, options;
    buttonText = $(this).text();
    effectName = $('#effectName').val();
    if (effectName === 'transfer') {
      options.to = '#doIt';
      options.className = 'ui-effects-transfer';
    }

    //$('.quote').toggle(); // in jQuery
    $('.quote').toggle(effectName, options); // in jQuery UI

    $(this).text(buttonText === 'Hide' ? 'Show' : 'Hide');
  });
});
