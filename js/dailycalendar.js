;(function($, window, document, undefined) {
  /**
   * Options, defaults, etc.
   */
  var pluginName = 'DailyCalendar'
    , pluginVersion = '0.0.1';


  var defaults = {

  };

  /**
   * Plugin constructor
   */
  function DailyCalendar(element, options) {
    // Allows us to accept either a native DOM element or a jQuery selector
    if (element instanceof jQuery) {
      this.$element = element;
    } else {
      this.$element = $(element);
    }

    this.$wrapper = $('<div class="dc-wrapper"></div>').appendTo(this.$element);
    this.$timeslotsWrapper = $('<div class="dc-timeslots-wrapper"></div>').appendTo(this.$wrapper);
    this.$eventsWrapper = $('<div class="dc-events-wrapper"></div>').appendTo(this.$wrapper);

    // Options specified at instantiation over-ride any defaults.
    this.options = $.extend({}, defaults, options);

    // Meta
    this._name = pluginName;
    this._version = pluginVersion;

    // Events
    this.events = [];

    this.init();
  }

  /**
   * Initializes the calendar
   */
  DailyCalendar.prototype.init = function() {
    // In case we lose `this` in closure
    var self = this;

    // Add events specified in the options
    this.options.events.forEach(function(event) {
      self.addEvent(event);
    });

    // Draw today
    self.drawDay(new Date());
  };

  /**
   * addEvent
   */
  DailyCalendar.prototype.addEvent = function(event) {
    var self = this;

    // If `event.end` has been omitted, set a default length of 1 hr
    if (typeof event.end === 'undefined') {
      event.end = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate(), event.start.getHours() + 1, event.start.getMinutes());
    }

    // Add the event to our instance
    this.events.push(event);
  };

  /**
   * Group an array of events into arrays of overlapping events
   * E.g., [a, b, c, d] -> [[a, b, c], [d]]
   */
  DailyCalendar.prototype.groupEvents = function(events) {
    /**
     * Checks whether two events overlap.
     * @returns BOOL
     */
    function overlap(a, b) {
      if (a.start <= b.start && a.end > b.start) {
        return true;
      } else if (a.start >= b.start && a.start < b.end) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Groups overlapping events
     */
    function groupOverlapping(list, groups, currentGroup) {
      var match = false;

      // On first execution of the function
      if (typeof groups === 'undefined') {

        // Sort the list on the first go-around
        list.sort(function(a, b) {
          if (a.start < b.start) return -1;
          if (a.start > b.start) return 1;

          return 0;
        });

        groups = [];
      }

      // Starting a new group
      if (typeof currentGroup === 'undefined') {
        currentGroup = [ list.shift() ];
      }

      currentGroup.forEach(function(a) {
        list.forEach(function(b, index) {
          if (overlap(a, b)) {
            currentGroup = currentGroup.concat(list.splice(index, 1));
            match = true;
          }
        });
      });

      if (match) {
        // A match was found, so we need to recursively call the function
        // to check if any other elements in `list` overlap the newly added item
        return groupOverlapping(list, groups, currentGroup);

      } else if (list.length) {
        // No matches found, so we're done building this group.
        // However, there are still items in the list that need to be grouped
        groups.push(currentGroup);
        return groupOverlapping(list, groups);
      }

      else {
        // No matches found and list is empty, we're ready to return the groups
        groups.push(currentGroup);
        return groups;
      }
    }

    return groupOverlapping(events);
  };

  /**
   * Draw a day
   */
  DailyCalendar.prototype.drawDay = function(day) {
    var self = this;
    var start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
    var end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

    // Define the timeslots
    var timeslots = [];
    for (var i = 0; i <= 23; i++) {
      var label;

      if (i === 0){
        label = '12';
      } else if (i > 12) {
        label = i - 12;
      } else {
        label = i;
      }

      // Morning or Afternoon
      label += (i < 12) ? 'am' : 'pm';

      timeslots.push({
        label: label,
        class: ''
      }, {
        label: '&nbsp;',
        class: 'dc-minor'
      });
    }

    // Render the `day` template
    this.$timeslotsWrapper.html(this.options.templates.day({
      day: day,
      timeslots: timeslots
    }));

    // Filter today's events
    var events = this.events.filter(function(event) {
      return start <= event.start && event.start <= end;
    });

    self.drawEvents(events);
  }

  DailyCalendar.prototype.drawEvents = function(events) {
    var self = this;

    // Group events by overlap
    events = self.groupEvents(events);

    events.forEach(function(group) {
      // If there are three overlapping events, width will be 33%
      var width = 1 / group.length * 100;

      group.forEach(function(event, index) {
        // For a group of three events, offsets would be 0%, 33%, and 66%
        var left = width * index;

        self.drawEvent(event, width, left);
      })
    })
  };

  DailyCalendar.prototype.drawEvent = function(event, width, left) {
    var self = this;

    var minutesInADay = 60 * 24;
    var beginningOfDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate(), 0, 0, 0);

    // Calculate px height per minute
    var minuteHeight = self.$eventsWrapper.height() / minutesInADay;

    // Calculate length of event in minutes. `n` ms * 1 second / 1000 ms * 1 min / 60 seconds
    var minuteLength = (event.end - event.start) / 1000 / 60;

    // Calculate percentage height (eventLength / minutesInDay);
    var height = ((minuteLength / minutesInADay) * 100);

    // Calculate start position
    // Divide by 1000 to convert ms -> sec, divide by 60 to convert seconds -> minutes
    // Divide by minutesInADay to calculate percentage of day, multiply by 100 for CSS-friendly value.
    var start = ((event.start - beginningOfDay) / 1000 / 60) / minutesInADay * 100;

    var html = self.options.templates.event(event);
    $(html)
    .width(width + '%')
    .height(height + '%')
    .css('left', left + '%')
    .css('top', start + '%')
    .appendTo(self.$eventsWrapper);
  }

  /**
   * Expose it to the world
   */
  window.DailyCalendar = DailyCalendar;

  /**
   * Expose it to the jQuery API.
   * This helps prevent multiple instances on the same element.
   */
  $.fn[pluginName] = function(options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new DailyCalendar(this, options));
      }
    });
  };

})(jQuery, window, document);
