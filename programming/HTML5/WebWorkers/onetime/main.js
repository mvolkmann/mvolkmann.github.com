/*jslint browser: true, indent: 2 */
/*global alert: true, document: true, window: true, Worker: true */

function $(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  $(id).textContent = text;
}

window.onload = function () {
  var worker = new Worker('worker.js');
  worker.onmessage = function (event) {
    setText('value', event.data);
  };
};
