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
 *  Here we map each paging event to a set of information that will be used
 *  to paginate our data. We will send the current page and the page size
 *  to the consumer.
 */
var pageUpdates = pagingEvents
    .map(function (page) {
        return {
            page: page,
            pageSize: PAGE_SIZE
        }
    })
    .startWith({page: 1, pageSize: PAGE_SIZE});


/**
 *  Stream of page models (created when a new page update occurs). We will map
 *  each user input to a new page model, which represents the current state of
 *  the application/page. We will later subscribe to this stream to update the UI.
 */
var pageModels = pageUpdates
    .map(function (options) {
        // Apply pagination
        var paginatedResults = Rx.Observable.from(resultsStore)
            .skip((options.page - 1) * options.pageSize)
            .take(options.pageSize);

        // Create a stream of page numbers (displayed at the bottom of the list for
        // navigation)
        var numberOfPages = Math.ceil(resultsStore.length / options.pageSize);
        var pageNumbers = Rx.Observable
            .range(1, numberOfPages)
            .map(function (n) { return { number: n, active: options.page !== n }});

        // Return the page's model
        return {
            totalSize: resultsStore.length,
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
