window.onload = () => {
  console.log('in onload');
  const canvas = document.getElementById('demo');
  const ctx = canvas.getContext('2d');

  const size = 400;
  const bgColor = 'yellow';
  const pointColor = 'blue';
  const lineColor = 'red';

  let lastX, lastY;

  // Paint the canvas background.
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  function point(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = pointColor;
    ctx.fill();

    // Prepare for next line.
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastX = x;
    lastY = y;
  }

  function firstListener(event) {
    const {offsetX: x, offsetY: y} = event;

    // Draw circle at first point.
    ctx.moveTo(x, y);
    point(x, y);

    canvas.removeEventListener('click', firstListener);
    canvas.addEventListener('click', restListener);
  }

  function restListener(event) {
    const {offsetX: x, offsetY: y} = event;

    // Draw line to new point.
    ctx.lineTo(x, y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.closePath();

    // Draw circle at last point to
    // cover part of line drawn over it.
    point(lastX, lastY);

    // Draw circle at new point.
    point(x, y);
  }

  canvas.addEventListener('click', firstListener);
};
