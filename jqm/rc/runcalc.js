/*jslint indent: 2 */
/*global $: true, calc: true */

var rc = {};

rc.calculate = function () {
  var distance, miles, timeString;

  distance = $('#distanceInput').val();
  if ($('#kmsRadio').attr('checked')) {
    miles = calc.convertKilometersToMiles(distance);
  } else {
    miles = distance;
  }

  timeString = $('#timeInput').val();

  $('#paceSpan').text(calc.getMilePaceTime(miles, timeString));
};

rc.creationComplete = function () {
  $('#distanceSelect').val('Marathon');
  rc.distanceSelectChanged();
  $('#timeInput').val('2:57:13');
  rc.inputChanged();
  rc.pageId = 'inputPage';
};

rc.distanceSelectChanged = function () {
  var distance = $('#distanceSelect').val();

  // If the distance ends in 'K' then it's kilometers,
  // otherwise it's miles.
  radioId = distance.match(/K$/) ? 'kmsRadio' : 'milesRadio';
  $('#' + radioId).attr('checked', true);

  // It's ridiculous that these must be manually refreshed!
  if (rc.inited) {
    $('#milesRadio').checkboxradio('refresh');
    $('#kmsRadio').checkboxradio('refresh');
  }

  $('#distanceInput').val(
    distance === '5K' ? '5' :
    distance === '5 mile' ? '5' :
    distance === '10K' ? '10' :
    distance === '10 mile' ? '10' :
    distance === 'Half Marathon' ? '13.1' :
    distance === 'Marathon' ? '26.2' : 'unknown');
};

rc.inputChanged = function () {
  var distance, distanceRE, time, timeRE;

  distanceRE = /^\d{1,2}(\.\d{1,2})?$/;
  distance = $('#distanceInput').val();
  if (!distance.match(distanceRE)) {
    alert('invalid distance, should look like 26.2');
    return;
  }

  timeRE = /^\d{1,2}(:\d{2}){0,2}$/;
  time = $('#timeInput').val();
  if (!time.match(timeRE)) {
    alert('invalid time, should look like 2:57:13');
    return;
  }

  $('#calcButton').attr('disabled',
    $('#distanceInput').val().length === 0 || 
    $('#timeInput').val().length === 0);
};

rc.swipe = function (event) {
  rc.pageId = rc.pageId === 'inputPage' ? 'imgPage' : 'inputPage';
  $.mobile.changePage($('#' + rc.pageId), 'slide');
};

$(document).ready(function () {
  $('#distanceInput').change(rc.inputChanged);
  $('#milesRadio').change(rc.inputChanged);
  $('#kmsRadio').change(rc.inputChanged);
  $('#distanceSelect').change(rc.distanceSelectChanged);
  $('#timeInput').change(rc.inputChanged);
  $('#calcButton').click(rc.calculate);
  $('#calcButton').attr('disabled', true);
  $('#inputPage').bind('swipe', rc.swipe);
  $('#imgPage').bind('swipe', rc.swipe);
  rc.creationComplete();
});

$('#inputPage').live('pagecreate', function (event) {
  rc.inited = true;
});
