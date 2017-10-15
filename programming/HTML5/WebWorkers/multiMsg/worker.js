/*jslint indent: 2 */
/*global postMessage: true, setInterval: true */

function postTime() {
  var now = new Date(), seconds;
  now = new Date();
  minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  seconds = now.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  postMessage(now.getHours() + ':' + minutes + ':' + seconds);
}

postTime();
var token = setInterval(postTime, 5000);
