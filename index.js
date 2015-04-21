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
 *  Filter updates (ie when a user enters new text in the search box)
 */
var searchInput = document.getElementById('search');
var searchEvents = Rx.Observable.fromEvent(searchInput, 'keyup')
    .map(function (e) { return $(e.target).val(); })
    .map(search)
    .startWith(function () { return true });


/**
 *  Paging updates (ie when a user selects a new page). This pattern was found at
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
 *  Combination of filter and paging updates (will capture any filtering/paging changes)
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
 *  Stream of page models (created when a new page update occurs)
 */
var pageModels = pageUpdates
    .map(function (options) {
        var results = JSON.parse(JSON.stringify(resultsStore))
            .filter(function (result) {
                return options.filter(result.title);
            });

        var paginatedResults = paginate(Rx.Observable.from(results), options);

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
 * Subscribe to the model updates and re-render the page
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
 * Pagination and Search
 */


function paginate (results, options) {
    return results
            .skip((options.page - 1) * options.pageSize)
            .take(options.pageSize);
}


function search (query) {
    return function (target) {
        if (!query) return true;

        /*
         * Very rudimentary search filter.
         */
        return target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    };
}
