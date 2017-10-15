/*jslint indent: 2 */
/*global clearInterval: true, onconnect: true, setInterval: true */

var sw = {}; // namespace - short for SharedWorker
sw.MIN = 0;
sw.MAX = 10;

sw.handle = function (event) { 
  var data = event.data;
  if (data === 'reset') {
    // Restart iteration from current value to MIN or MAX.
    sw.reset();
  } else if (typeof data === 'number') {
    // Pass any number to set a new increment.
    sw.increment = data;
    sw.post('change increment to ' + event.data);
  } else {
    // Echo the message that was received.
    sw.post('received ' + (typeof data) + '"' + data + '" in worker');
  }
}; 

sw.post = function (msg) {
  sw.port.postMessage(msg);
};

sw.reset = function () {
  sw.post('performing reset');
  if (sw.intervalId) {
    clearInterval(sw.intervalId);
  }
  sw.intervalId = setInterval(sw.step, 1000);
};

sw.step = function () {
  sw.value += sw.increment;
  if (sw.value <= sw.MIN) {
    clearInterval(sw.intervalId);
    sw.value = sw.MIN;
  } else if (sw.value >= sw.MAX) {
    clearInterval(sw.intervalId);
    sw.value = sw.MAX;
  }

  sw.post('stepped to ' + sw.value);
};

// onconnect is a property in the SharedWorkerGlobalScope.
onconnect = function (event) { 
  sw.port = event.ports[0]; // Why is there an array of ports?

  sw.post('connected to worker from origin "' + event.origin + '"');

  /*
  for (var prop in event) {
    sw.post('event.' + prop + ' = ' + event[prop]);
  }
  */

  // TODO: How can you determine that the worker has already been started
  // TODO: and avoid resetting the value and increment?
  if (!sw.value) {
    sw.value = 5;
  }

  if (!sw.increment) {
    sw.increment = -1;
  }

  // Register function to be invoked when a message is received.
  sw.port.onmessage = sw.handle;
}; 
