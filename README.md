# Daily Calendar
A simple day-view event calendar.

## Dependencies
* Underscore or LoDash, for rendering templates
* jQuery

## Development
Clone the repo, then `npm install && bower install && grunt develop` (also depends on the Compass gem being installed)

## Changelog
Any changes made since submitting the code sample:

* Enabled paging between days
* Improved overlapping event grouping function

## TO-DO
* ~~General clean up~~
* ~~Improve performance of overlapping event function~~
* Improve packaging of default pre-compiled templates. Ideally, they should be tucked into the same dailycalendar.js file, and hidden from the global scope.
* Draw timeslots table only once. The performance of precompiled underscore templates might make this a non-issue, though.
