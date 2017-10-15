/*jslint indent: 2 */

function $(id) {
  return document.getElementById(id);
}

function rotate(elem, transform) {
  elem.style.transform = transform;
  elem.style.MozTransform = transform; // note capital M!
  elem.style.msTransform = transform;
  elem.style.webkitTransform = transform;
}

window.onload = function () {
  $('go').disabled = false; // needed to reset in Firefox

  $('go').onclick = function () {
    this.disabled = true;
    var box = $('box');
    box.style.backgroundColor = 'red';
    box.style.color = 'white';
    box.style.left = '600px';
    //box.style.fontSize = '48pt';
    //box.style.width = box.style.height = box.style.lineHeight = '200px';
    rotate(box, 'rotate(360deg) scale(2, 2)');
  };
};
