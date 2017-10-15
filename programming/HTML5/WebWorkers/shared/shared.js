/*jslint indent: 2 */
/*global document: true, SharedWorker: true, window: true */

var wc = {}; // namespace - short for Worker Client

wc.handler = function (event) {
  wc.log(event.data);
};

wc.log = function (message) { 
  document.getElementById('log').innerHTML += message + '<br>'; 
};

wc.startWorker = function (increment) {
  // Create a new worker.
  if (wc.worker) {
    wc.log('using existing worker'); 
    //wc.worker.terminate();
  } else {
    wc.log('creating new worker'); 
    wc.worker = new SharedWorker('worker.js', 'pingpong');

    // Run the "handler" function when a message is received from the worker.
    wc.worker.port.addEventListener(
      'message', wc.handler, false); // bubbling, not capture

    // Connect to the worker, causing its "onconnect" function to run.
    wc.worker.port.start();
  }

  wc.worker.port.postMessage('reset');
  wc.worker.port.postMessage(increment);
};
