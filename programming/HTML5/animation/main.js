/*jslint browser: true, indent: 2 */
/*global '$' */

var canvas, ctx, interval, isRunning = false;
var radius = 20;
var position = { x: radius + 1, y: radius + 1 };
var move = { dx: 2, dy: 1 };
var twoPi = Math.PI * 2;

function setRunning(running) {
  if (running == isRunning) return;
  isRunning = running;
  if (isRunning) {
    interval = setInterval(update, 5);
  } else {
    clearInterval(interval);
  }
}

function drawShape(fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, twoPi, false);
  ctx.closePath();
  ctx.fill();
}

function getGradient() {
  var gradient = ctx.createRadialGradient(
    position.x, position.y, radius,
    position.x + 5, position.y - 5, radius/4);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1, 'white');
  return gradient;
}

function moveShape() {
  if (position.x - radius <= 0 || position.x + radius >= canvas.width()) {
    move.dx = -move.dx;
  }
  if (position.y - radius <= 0 || position.y + radius >= canvas.height()) {
    move.dy = -move.dy;
  }
  position.x += move.dx;
  position.y += move.dy;
}

function update() {
  drawShape(canvas.css('background-color')); // erase previous
  moveShape();
  radius -= 1; // why necessary?
  drawShape(getGradient()); // draw new
  radius += 1; // why necessary?
}

$(document).ready(function () {
  canvas = $('#c1');
  ctx = canvas.get(0).getContext('2d');

  canvas.mousedown(function (event) {
    alert('got mousedown at ' + event.clientX + ',' + event.clientY);
    alert('canvas is at ' + canvas.clientLeft + ',' + canvas.clientTop);
  });

  setRunning(true);
});
