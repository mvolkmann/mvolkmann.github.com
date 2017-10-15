'use strict';

window.onload = function () {
  console.log('got onload');
  var form = document.getElementById('myform');
  console.log('form =', form);
  form.style.borderColor = 'black';
  form.style.borderStyle = 'solid';
  form.style.borderWidth = '3px';
  console.log('form.addEventListener =', form.addEventListener);
  var name = document.getElementById('name');

  var listener = function (event) {
    console.log('name = "' + name.value + '"');
    console.log('name.length =', name.length);
    if (name.value.length === 0) event.preventDefault();
    //if (name.value.length === 0) return false; // works everywhere but IE (tested IE9)
  };

  form.addEventListener('submit', listener);
  //form.onsubmit = listener;
};
