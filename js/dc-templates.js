this["JST"] = this["JST"] || {};

this["JST"]["day"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<table class="table table-bordered table-hover dc-timeslots">\n  <thead>\n    <th></th>\n    <th>\n      <h3>' +((__t = ( day.toDateString() )) == null ? '' : __t) +'</h3>\n\n      <nav class="dc-navigation" role="navigation">\n        <button value="prev">Previous</button>\n        <button value="today">Today</button>\n        <button value="next">Next</button>\n      </nav>\n    </th>\n  </thead>\n  <tbody>\n    '; _.each(timeslots, function(slot, index) { ;__p += '\n    <tr class="slot-' +__e( index ) +' ' +__e( slot.class ) +'">\n      <th>' +((__t = ( slot.label )) == null ? '' : __t) +'</th>\n      <td class="dc-event-content"><div></div></td>\n    </tr>\n    '; }); ;__p += '\n  </tbody>\n</table>\n';}return __p};

this["JST"]["event"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="dc-event">\n  <p><strong>' +__e( title ) +'</strong></p>\n  <p><small>\n    <strong>Start:</strong> ' +__e( start.toLocaleTimeString() ) +',\n    <strong>End:</strong> ' +__e( end.toLocaleTimeString() ) +'\n  </small></p>\n</div>\n';}return __p};