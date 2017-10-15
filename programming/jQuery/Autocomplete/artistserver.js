/*jslint indent: 2, nomen: false */
/*global console: true, __dirname: true */
// Setting nomen to false allows leading underscores in __dirname.

// This is an HTTP service that returns a JSON array
// of artist name strings from the file artists.json
// that contain a given "term" (passed as a query parameter).
// The JSON array is returned using JSONP.

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    HOST = '127.0.0.1',
    PORT = 3000,
    BAD_REQUEST = 400,
    SUCCESS = 200;

http.createServer(function (req, res) {
  var parsed, path;

  // The true parameter causes query parameters to be parsed.
  parsed = url.parse(req.url, true);
  path = __dirname + '/artists.json';

  fs.readFile(path, function (err, buffer) {
    var artists, data, header, matches = [], re, statusCode;

    if (err) {
      data = path + ' not found';
      statusCode = BAD_REQUEST;
    } else {
      // Get the artist names that contain the given term.
      //console.log('term = "' + parsed.query.term + '"');
      re = new RegExp(parsed.query.term, 'i'); // ignore case
      artists = JSON.parse(buffer.toString());
      artists.forEach(function (artist) {
        if (re.test(artist)) {
          matches.push(artist);
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
