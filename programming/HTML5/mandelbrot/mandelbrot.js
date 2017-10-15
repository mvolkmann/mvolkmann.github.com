'use strict';

var MAX_ITERS = 256;
var ZOOM_DELTA = 0.2;
var canvas, context, height, image, pixels, scale = 1.0, width;

var mbMinX = -2.1;
var mbMaxX = 1.1;
var mbMinY = -1.4;
var mbMaxY = 1.4;

var mbWidth = mbMaxX - mbMinX;
var mbHeight = mbMaxY - mbMinY;

var mbCenterX = mbMinX + mbWidth / 2.0;
var mbCenterY = mbMinY + mbHeight / 2.0;

var zoomFactor = 1 - ZOOM_DELTA;

function mandelbrot(centerPixelX, centerPixelY, scale) {

  // Calculate new center coordinates in Mandelbrot coordinates.
  var fractionX = 1.0 * centerPixelX / width;
  var fractionY = 1.0 * centerPixelY / height;
  mbCenterX = mbMinX + fractionX * mbWidth;
  mbCenterY = mbMinY + fractionY * mbHeight;

  // Calculate new upper-left coordinates in Mandelbrot coordinates.
  mbWidth *= scale;
  mbHeight *= scale;
  mbMinX = mbCenterX - mbWidth / 2.0;
  mbMinY = mbCenterY - mbHeight / 2.0;

  var index = 0;

  // For each pixel in the y direction ...
  for (var pixelY = 0; pixelY < height; pixelY++) {

    // Translate pixelY to Mandelbrot y.
    var mbY = mbMinY + mbHeight * pixelY / height;

    // For each pixel in the x direction ...
    for (var pixelX = 0; pixelX < width; pixelX++) {

      // Translate pixelX to Mandelbrot x.
      var mbX = mbMinX + mbWidth * pixelX / width;

      // Determine the number of iterations required
      // for some crazy math formula to reach 2 squared.
      var x = mbX;
      var y = mbY;
      var iter = 0;
      while (iter < MAX_ITERS) {
        var xSquared = x * x;
        var ySquared = y * y;
        if (xSquared + ySquared >= 4) {
          break;
        }
        var temp = xSquared - ySquared + mbX;
        y = 2 * x * y + mbY;
        x = temp;
        iter++;
      }

      // Set the color of the current pixel.
      pixels[index++] = iter % 8 * 32; // red
      pixels[index++] = iter % 16 * 16; // green
      pixels[index++] = iter % 32 * 8;  // blue
      pixels[index++] = 255; // alpha - fully opaque
    }
  }

  context.putImageData(image, 0, 0);
}

function $(id) {
  return document.getElementById(id);
}

window.onload = function () {
  canvas = $('mandelbrot');
  context = canvas.getContext('2d');

  width = context.canvas.width;
  height = context.canvas.height;

  image = context.createImageData(width, height);
  pixels = image.data;

  mandelbrot(width / 2, height / 2, scale);

  canvas.onclick = function (evt) {
    var x = evt.pageX - canvas.offsetLeft;
    var y = evt.pageY - canvas.offsetTop;
    scale *= zoomFactor;
    mandelbrot(x, y, scale);
  };

  $('in').onchange = function () {
    zoomFactor = 1 - ZOOM_DELTA;
    scale = 1.0;
  };

  $('out').onchange = function () {
    zoomFactor = 1 + ZOOM_DELTA;
    scale = 1.0;
  };
};
