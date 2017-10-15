$(document).ready(function () {
  $('#switch').click(function () {
    var img = $('#dasher');
    var src = img.attr('src');
    var choices = ['Dasher1.jpg', 'Dasher2.jpg'];
    img.attr('src', src === choices[0] ? choices[1] : choices[0]);
  });
});
