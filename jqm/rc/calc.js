/*jslint indent: 2 */
/*global console.log: true */

var calc = {};

calc.KILOMETERS_PER_MILE = 1.609;
calc.MILES_PER_KILOMETERS = 0.6214;

calc.convertKilometersToMiles = function (kilometers) {
  return kilometers * calc.MILES_PER_KILOMETERS;
};

calc.convertMilesToKilometers = function (miles) {
  return miles * calc.KILOMETERS_PER_MILE;
};

// Converts a time string to the equivalent number of seconds.
// Times are in the format hh:mm:ss, mm:ss or ss.
calc.convertTimeToSeconds = function (timeString) {
  var count, hours, minutes, pieces, re, seconds;

  // Validate the time.
  re = /(\d{1,2}):(\d{1,2}){0,2}/;
  if (!re.test(timeString)) {
    alert('"' + timeString + "\" is an invalid time.");
    return 0;
  }

  pieces = timeString.split(":");
  count = pieces.length;

  hours = count === 3 ? pieces[0] : 0;

  minutes =
    count === 3 ? pieces[1] :
    count === 2 ? pieces[0] :
    0;

  seconds =
    count === 3 ? pieces[2] :
    count === 2 ? pieces[1] :
    pieces[0];

  return (Number(hours)*60 + Number(minutes))*60 + Number(seconds);
};

// Gets the pace time string for a given distance (in miles)
// and total time.  Times are in the format hh:mm:ss, mm:ss or ss.
calc.getMilePaceTime = function (miles, time) {
  var minutesPerMile, pace, seconds, secondsPerMile,
    wholeMinutesPerMile, wholeSecondsPerMile;

  seconds = calc.convertTimeToSeconds(time);
  secondsPerMile = seconds / miles;
  minutesPerMile = secondsPerMile / 60.0;
  wholeMinutesPerMile = Math.floor(minutesPerMile);
  wholeSecondsPerMile =
    Math.round((minutesPerMile - wholeMinutesPerMile) * 60.0);
  pace = wholeMinutesPerMile.toString() + ':';
  if (wholeSecondsPerMile < 10) {
    pace += '0';
  }
  pace += wholeSecondsPerMile;
  return pace;
};
