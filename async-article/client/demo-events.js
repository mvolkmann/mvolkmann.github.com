/* global Rx: false */

window.onload = () => {
  const useRx = true;
  const showPoints = true;

  const BG_COLOR = 'linen';
  //const EVENT_NAME = 'click';
  const EVENT_NAME = 'mousemove';
  const LINE_COLOR = 'red';
  const POINT_COLOR = 'blue';
  const POINT_SIZE = 2;
  const SIZE = 400;

  let intervalId, lastX, lastY, pointCount = 0, source, subscription;

  function addPoint(x, y) {
    if (pointCount > 0) {
      // Draw line from last point to new point.
      ctx.lineTo(x, y);
      ctx.strokeStyle = LINE_COLOR;
      ctx.stroke();
      ctx.closePath();

      // Draw last point again to cover
      // part of line drawn over it.
      point(lastX, lastY);
    }

    // Draw new point.
    point(x, y);

    pointCount++;
  }

  function auto() {
    pointCount = 0;
    intervalId = setInterval(async () => {
      const [x, y] = await getRandomPoint();
      addPoint(x, y);
    }, 500);
  }

  function clear(ctx) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, SIZE, SIZE);
    reset();
  }

  const pointUrl = 'http://localhost:3002/random-point?max=' + SIZE;
  function getRandomPoint() {
    return fetch(pointUrl).then(res => res.json());
  }

  function point(x, y) {
    if (showPoints) {
      ctx.beginPath();
      ctx.arc(x, y, POINT_SIZE, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = POINT_COLOR;
      ctx.fill();
    }

    // Prepare for next line.
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastX = x;
    lastY = y;
  }

  function reset() {
    lastX = lastY = 0;

    if (useRx) {
      if (subscription) {
        subscription.unsubscribe();
        subscription = source.subscribe(firstListener);
      }
    } else {
      canvas.removeEventListener(EVENT_NAME, lastListener);
      canvas.addEventListener(EVENT_NAME, firstListener);
    }
  }

  function firstListener(event) {
    const {offsetX: x, offsetY: y} = event;

    // Draw circle at first point.
    ctx.moveTo(x, y);
    point(x, y);

    if (useRx) {
      subscription.unsubscribe();
      subscription = source.subscribe(lastListener);
    } else {
      canvas.removeEventListener(EVENT_NAME, firstListener);
      canvas.addEventListener(EVENT_NAME, lastListener);
    }
  }

  function lastListener(event) {
    const {offsetX: x, offsetY: y} = event;
    addPoint(x, y);
  }

  const canvas = document.getElementById('demo');
  const ctx = canvas.getContext('2d');
  clear(ctx); // paints canvas background

  const autoBtn = document.getElementById('autoBtn');
  autoBtn.addEventListener('click', auto);

  const stopBtn = document.getElementById('stopBtn');
  stopBtn.addEventListener('click', () => clearInterval(intervalId));

  const clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', () => clear(ctx));

  //TODO: You could call a REST service repeatedly
  //TODO: to get random points to plot!
  //TODO: That might make it easier to demonstrate Promises.

  if (useRx) {
    source = Rx.Observable.fromEvent(canvas, EVENT_NAME);
    subscription = source.subscribe(firstListener);
    Rx.Observable.fromEvent(canvas, 'mouseleave').subscribe(reset);
  } else {
    canvas.addEventListener(EVENT_NAME, firstListener);
    canvas.addEventListener('mouseleave', reset);
  }
};
