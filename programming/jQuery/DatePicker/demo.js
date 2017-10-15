/*jslint indent: 2 */
/*global $: true, console: true, document: true */

function beforeShowDay(date) { // a Date object
  var cssClass, isToday, isWeekDay, myBd, tooltip;

  isWeekDay = $.datepicker.noWeekends(date)[0];
  if (!isWeekDay) return [false];

  myBd = date.getMonth() === 3 && date.getDate() === 16;
  isToday = date.toDateString() === new Date().toDateString();

  // CSS will only be applied if date is selectable.
  // In this example, Saturdays and Sundays are not.
  cssClass = myBd || isToday ? 'special' : '';
  tooltip = myBd ? "Mark's Birthday!" : '';

  return [true, cssClass, tooltip];
}

$(document).ready(function () {
  var dp = $('#bd').datepicker({
    beforeShowDay: beforeShowDay,
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy MM d', // 4 digit year, full month name, day of month
    defaultDate: '2010 September 9',
    minDate: '2008 January 1',
    maxDate: '+9M', // nine months from today
    showAnim: 'scale',
    showButtonPanel: true,
    showOn: 'both'
  });
});
