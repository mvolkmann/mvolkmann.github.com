$(document).ready(function () {
  $('#fb, #fa, #fc').button();
  $('#cart').button({
    icons: { primary: 'ui-icon-cart' },
    label: 'Show Cart'
  });
  $('#fr').buttonset();
  $('#fb').click(function () { alert('Got press'); });
});
