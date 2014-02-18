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
* Improve packaging of default pre-compiled templates.
* Draw timeslots table only once (due to the way underscore templates work, I don't think this is such a performance hit)
