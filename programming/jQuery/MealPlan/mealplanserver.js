'use strict';
/*jslint indent: 2, nomen: false */
/*global console: true, __dirname: true */
// Setting nomen to false allows leading underscores in __dirname.

// This is an HTTP service that returns a JSON array
// of food item strings from the file mealplan.json
// that contain a given "term" (passed as a query parameter).
// The JSON array is returned using JSONP.

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    HOST = '127.0.0.1',
    PORT = 3000,
    BAD_REQUEST = 400,
    SUCCESS = 200;

http.createServer(function (req, res) {
  var parsed, path;

  // The true parameter causes query parameters to be parsed.
  parsed = url.parse(req.url, true);
  path = __dirname + '/mealplan.json';

  fs.readFile(path, 'utf8', function (err, content) {
    var items, data, header, matches = [], re, statusCode;

    if (err) {
      data = path + ' not found';
      statusCode = BAD_REQUEST;
    } else {
      // Get the items that contain the given term.
      //console.log('term = "' + parsed.query.term + '"');
      re = new RegExp(parsed.query.term, 'i'); // ignore case
      items = JSON.parse(content);
      items.forEach(function (item) {
        if (re.test(item)) {
          matches.push(item);
        }
      });

      data = parsed.query.callback + '(' + JSON.stringify(matches) + ')';
      statusCode = SUCCESS;
    }

    // Either content type works!
    //header = { 'Content-Type': 'application/json' };
    header = { 'Content-Type': 'text/javascript' };
    res.writeHead(statusCode, header);
    //console.log('data = "' + data + '"');
    res.end(data);
  });
}).listen(PORT, HOST);

console.log('Server running at http://' + HOST + ':' + PORT);
