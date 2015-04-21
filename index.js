/**
 *  Libararies
 */
 var Rx = require('rx');
 var $ = require('jQuery');
 var resultsStore = require('./movies');


 /**
  * Templates
  */
 var templates = {};
 templates.results = require('./templates/results.handlebars');
 templates.pageNumbers = require('./templates/page-numbers.handlebars');


/**
 *  Page size
 */
 var PAGE_SIZE = 8;


/**
 *  Filter updates. Each time a user enters text in the search box, we will
 *  map this event to a string value (the entered text) and push it to our
 *  data stream.
 */
var searchInput = document.getElementById('search');
var searchEvents = Rx.Observable.fromEvent(searchInput, 'keyup')
    .map(function (e) { return $(e.target).val(); })
    .map(search)
    .startWith(function () { return true });


/**
 *  Paging updates (ie when a user selects a new page). Every time an <a> element
 *  is clicked, we will map that event to a number and push it to our data stream.
 *
 *  This pattern was found at
 *  https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/events.md to
 *  subsribe to events for dom elements that may/may not be present yet.
 */
var $pageLinks = $('.results-container');
var pagingEvents = Rx.Observable.fromEventPattern(
    function addHandler (h) { $pageLinks.on('click', 'a', h)},
    function delHandler (h) { $pageLinks.off('click', 'a', h)})
    .map(function (e) {
        return parseInt($(e.target).text());
    })
    .startWith(1);

/**
 *  Here we combine the search events and the paging events. We can think of the
 *  search events as the parent stream, which then spawns other streams when
 *  different pages get selected. I think this is easier to conceptulaize by
 *  playing with the demo.
 */
var pageUpdates = searchEvents
    .selectMany(function (search) {
        return pagingEvents
            .map(function (page) {
                return {
                    filter: search,
                    page: page,
                    pageSize: PAGE_SIZE
                }
            })
            .startWith({filter: search, page: 1, pageSize: PAGE_SIZE});
    });


/**
 *  Stream of page models (created when a new page update occurs). We will map
 *  each user input to a new page model, which represents the current state of
 *  the application/page. We will later subscribe to this stream to update the UI.
 */
var pageModels = pageUpdates
    .map(function (options) {
        // Filter our results based on the supplied filter (mapped from text-input)
        var results = JSON.parse(JSON.stringify(resultsStore))
            .filter(function (result) {
                return options.filter(result.title);
            });

        // Apply pagination
        var paginatedResults = Rx.Observable.from(results)
            .skip((options.page - 1) * options.pageSize)
            .take(options.pageSize);;

        // Create a stream of page numbers (displayed at the bottom of the list for
        // navigation)
        var numberOfPages = Math.ceil(results.length / options.pageSize);
        var pageNumbers = Rx.Observable
            .range(1, numberOfPages)
            .map(function (n) { return { number: n, active: options.page !== n }});

        // Return the page's model
        return {
            totalSize: results.length,
            results: paginatedResults,
            pageNumbers: pageNumbers
        }
    });


/**
 * Here we subscribe to the stream of model updates and rerender the page.
 */
pageModels.subscribe(function render (model) {
    model.results
        .toArray()
        .subscribe(function (displayedResults) {
            // Render the displayed results
            $('.results').html(templates.results({ results: displayedResults }));

            // Render the pagination information
            model.pageNumbers
                .toArray()
                .subscribe(function (pageNumbers) {
                    $('.pagination').html(templates.pageNumbers({
                        pageNumbers: pageNumbers,
                        totalSize: model.totalSize
                    }));
                })
        });
});


/**
 * Search
 */


function search (query) {

    /*
     * Very rudimentary search filter.
     */
    return function (target) {
        if (!query) return true;
        return target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    };
}
