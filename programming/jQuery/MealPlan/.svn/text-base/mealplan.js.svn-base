'use strict';
/*jslint indent: 2 */
/*global $: true, alert: true, console: true, document: true */

var mp = {}; // namespace

mp.day = 'Sun'; // default
mp.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
mp.meal = 'Breakfast'; // default
mp.meals = ['Breakfast', 'Lunch', 'Dinner'];

// This must be defined before it is referenced
// in mp.droppableOptions!
mp.drop = function (event, ui) {
  var droppable, dayOrMeal;
  droppable = $(this); // an "a" element for a tab or accordion panel
  dayOrMeal = droppable.text().split(' ')[0];
  mp.dropItem($(ui.draggable), dayOrMeal); // into new day/meal
  mp.updateProgress();
};

mp.droppableOptions = {
  activeClass: 'compatibleTarget',
  drop: mp.drop,
  hoverClass: 'overTarget'
};

//--------------------------------------------------------------------------

$(document).ready(function () {
  var effect = 'blind', items, itemText;
 
  //if (console && console.clear) {
  //  console.clear();
  //}

  $('#printView').hide();
  $('#switchViewButton').button();
  $('#switchViewButton').toggle(
    function () {
      mp.fillTable();
      $(this).children('span').text('Edit View');
      $('#editView').hide(effect);
      $('#printView').show(effect);
    },
    function () {
      $(this).children('span').text('Print View');
      $('#printView').hide(effect);
      $('#editView').show(effect);
    });

  $('h1, label').addClass('ui-widget'); // for font

  $('#startDate').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'm/d/yy',
    onClose: mp.addDates,
    showButtonPanel: true,
    showOn: 'both' // focus and button
  });
  $('#startDate').val(mp.getFormattedDate());

  $('#progress').progressbar();

  mp.addTabs('tabs', mp.days, mp.days);
  mp.days.forEach(function (day) {
    mp.addAccordion(day, mp.meals);
  });
  mp.addDates(new Date().toString()); // to tabs

  items = ['banana', 'burritos', 'cereal', 'gatorade', 'lemonade',
    'orange juice', 'lasagna', 'pizza', 'spaghetti'];
  itemText = $('#itemText');
  itemText.autocomplete({
    //source: items
    source: mp.getPossibleItems
  });

  itemText.keyup(function (event) {
    if (event.which === 13) { // enter key
      mp.addItem();
    }
  });
  itemText.focus();

  $('#addButton').button();
  $('#addButton').click(mp.addItem);

  $('#trash').droppable({
    drop: function (event, ui) {
      $(ui.draggable).remove(); // actual item
      $('.ui-draggable-dragging').remove(); // helper clone
      $('#trash').attr('src', 'trashCanClosed.png');
      mp.updateProgress();
    },
    out: function (event, ui) {
      $('#trash').attr('src', 'trashCanClosed.png');
    },
    over: function (event, ui) {
      $('#trash').attr('src', 'trashCanOpen.png');
    }
  });
});

//--------------------------------------------------------------------------

mp.addAccordion = function (containerId, labels) {
  var container = $('#' + containerId);

  labels.forEach(function (label) {
    var anchor, div, divId;
    divId = containerId + '-' + label;
    div = $('<div id="' + divId + '">');

    // This conflicts with draggable.
    //div.sortable({
    //  axis: 'y',
    //  cursor: 'pointer'
    //});
    
    anchor = $('<a>' + label + '</a>');
    anchor.droppable(mp.droppableOptions);
    container
      .append($('<h3>').append(anchor))
      .append(div);
  });

  container.accordion({
    autoHeight: false,
    change: function (event, ui) {
      mp.meal = ui.newHeader.text();
    }
  });
};

mp.addDates = function (dateText) {
  var date = new Date(dateText);

  // Change date to previous Sunday.
  date.setDate(date.getDate() - date.getDay());

  // For each tab anchor ...
  $('#tabs > ul > li > a').each(function (index, a) {
    var anchor = $(a), day;
    day = anchor.text().split(' ')[0]; // get day abbreviation
    dateText = (date.getMonth() + 1) + '/' + date.getDate();
    anchor.text(day + ' ' + dateText);
    date.setDate(date.getDate() + 1); // advance by one day
  });
};

mp.addItem = function () {
  var itemDiv, itemText = $('#itemText');
  itemDiv = mp.createItem(itemText.val());
  mp.dropItem(itemDiv, mp.day);
  itemText.val('');
  itemText.focus();

  mp.updateProgress();
};

mp.addTab = function (containerId, tabId, tabLabel) {
  var container = $('#' + containerId);

  // Add li for tab.
  container.children('ul').append(
    '<li><a href="#' + tabId + '">' + tabLabel + '</a></li>');

  // Add div for tab content.
  container.append('<div id="' + tabId + '">');
};

mp.addTabs = function (containerId, tabIds, tabLabels) {
  var container = $('#' + containerId);
  container.append('<ul>');

  tabIds.forEach(function (tabId, index) {
    mp.addTab(containerId, tabId, tabLabels[index]);
  });

  container.tabs({
    select: function (event, ui) {
      mp.day = ui.panel.id;

      // Open the accordion for this day to the current meal.
      $('#' + mp.day).accordion(
        'activate', mp.meals.indexOf(mp.meal));
    }
  });

  $('#tabs > ul > li > a').droppable(mp.droppableOptions);
};

mp.createItem = function (text) {
  var itemDiv = $('<div class="item">');
  itemDiv.text(text);
  itemDiv.draggable({
    appendTo: 'body', // can't drag out of Accordion without this
    containment: 'body',
    cursor: 'pointer',
    helper: 'clone', // can't drag out of Accordion without this
    revert: 'invalid',
    start: function () {
      $(this).hide();
    },
    stop: function () {
      $(this).show();
    }
  });

  return itemDiv;
};

mp.dropItem = function (itemDiv, dayOrMeal) {
  var target;

  if (mp.inArray(mp.days, dayOrMeal)) {
    mp.day = dayOrMeal;
  } else if (mp.inArray(mp.meals, dayOrMeal)) {
    mp.meal = dayOrMeal;
  } else {
    throw '"' + dayOrMeal + '" is an invalid drop target';
  }

  target = $('#' + mp.day + '-' + mp.meal);
  target.append(itemDiv);

  // Select the tab for the day on which it was dropped.
  $('#tabs').tabs('select', mp.days.indexOf(mp.day));

  // Open the accordion panel for the meal on which it was dropped.
  $('#' + mp.day).accordion('activate', mp.meals.indexOf(mp.meal));

  // TODO: Why is this necessary?
  target.css({
    height: '',
    paddingTop: 5,
    paddingBottom: 5
  });
};

mp.fillTable = function () {
  var table, td, tr;
  table = $('#printTable');
  table.empty();

  tr = $('<tr>');
  table.append(tr);

  // For each tab anchor ...
  $('#tabs > ul > li > a').each(function (index, a) {
    tr.append('<th>' + $(a).text() + '</th>');
  });

  mp.meals.forEach(function (m) {
    tr = $('<tr>');
    table.append(tr);

    mp.days.forEach(function (d) {
      td = $('<td>');
      tr.append(td);
      mp.getAddedItems(d, m).forEach(function (item) {
        td.append(item + '<br/>');
      });
    });
  });
};

// Returns array of items that have been entered
// for a given day and meal.
mp.getAddedItems = function (day, meal) {
  var items = [];
  $('#' + day + '-' + meal + ' > div').each(function (index, div) {
    items.push($(div).text());
  });
  return items;
};

mp.getFormattedDate = function (date) {
  if (!date) {
    date = new Date();
  }
  return (date.getMonth() + 1) + '/' +
    date.getDate() + '/' + date.getFullYear();
};

mp.getMealCount = function () {
  var count = 0, items;

  mp.days.forEach(function (day) {
    mp.meals.forEach(function (meal) {
      items = mp.getAddedItems(day, meal);
      if (items.length > 0) {
        count += 1;
      }
    });
  });

  return count;
};

mp.getPossibleItems = function (req, callback) {
  $.ajax({
    url: 'http://localhost:3000',
    dataType: 'jsonp',
    data: {
      term: req.term
    },
    success: callback
  });
  // TODO: Make this use a local array of items
  // TODO: if the service isn't available.
};

// Returns a boolean indicating if an element is in an array.
// $.inArray isn't reliable in IE!
mp.inArray = function (array, element) {
  return array.indexOf(element) !== -1;
};

mp.log = function (msg) {
  if (console) {
    console.log(msg);
  }
};

mp.updateProgress = function () {
  var count = mp.getMealCount();
  $('#count').text(count);
  $('#progress').progressbar('value', 100 * count / 27);
};
