/**
 *  Libararies
 */
 var Rx = require('rx');
 var $ = require('jQuery');
 var resultsStore = require('./movies');
 var pagination = require('./src/pagination');
 var searchUtils = require('./src/search');


 /**
  *  Pagination
  */
 var search = searchUtils.search;
 var tokenize = searchUtils.tokenize;
 var highlightMatches = searchUtils.highlightMatches;
 var paginate = pagination.paginate;


 /**
  * Templates
  */
 var templates = {};
 templates.results = require('./templates/results.handlebars');
 templates.pageNumbers = require('./templates/page-numbers.handlebars');


/**
 *  Page size
 */
 var PAGE_SIZE = 7;


/**
 *  Filter updates (ie when a user enters new text in the search box)
 */
var searchInput = document.getElementById('search');
var searchEvents = Rx.Observable.fromEvent(searchInput, 'keyup')
    .map(function (e) { return e.target.value })
    .map(tokenize)
    .map(search)
    .startWith({filter: function () { return true }, query: []});


/**
 *  Paging updates (ie when a user selects a new page). This pattern was found at
 *  https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/events.md to
 *  subsribe to events for dom elements that may/may not be present yet.
 */
var $pageLinks = $('.results-container');
var pagingEvents = Rx.Observable.fromEventPattern(
    function addHandler (h) { $pageLinks.on('click', 'a', h)},
    function delHandler (h) { $pageLinks.off('click', 'a', h)})
    .map(function (e) { return parseInt(e.target.text) })
    .startWith(1);

/**
 *  Combination of filter and paging updates (will capture any filtering/paging changes)
 */
var pageUpdates = searchEvents
    .selectMany(function (search) {
        return pagingEvents
            .map(function (page) {
                return {
                    filter: search.filter,
                    page: page,
                    pageSize: PAGE_SIZE,
                    query: search.query
                }
            })
            .startWith({filter: search.filter, query: [], page: 1, pageSize: PAGE_SIZE});
    });


/**
 *  Stream of page models (created when a new page update occurs)
 */
var pageModels = pageUpdates
    .map(function (options) {
        options.items = JSON.parse(JSON.stringify(resultsStore))
            .filter(function (result) {
                return options.filter(tokenize(result.title));
            });

        var paginatedResults = paginate(options);

        var numberOfPages = Math.ceil(options.items.length / options.pageSize);
        var pageNumbers = Rx.Observable
            .range(1, numberOfPages)
            .map(function (n) { return { number: n, active: options.page !== n }});

        var startIndex = (options.page - 1) * options.pageSize + 1;
        var endIndex = startIndex + options.pageSize - 1;
        if (endIndex > options.items.length) endIndex = options.items.length;

        // Return the page's model
        return {
            query: options.query,
            totalSize: options.items.length,
            results: paginatedResults,
            pageNumbers: pageNumbers,
            currentPage: options.page,
            startIndex: startIndex,
            endIndex: endIndex
        }
    });


/**
 * Subscribe to the model updates and re-render the page
 */
pageModels.subscribe(function render (model) {
    model.results
        // Add match-highlighting
        .map(function (result) {
            result.title = highlightMatches(result.title, model.query);
            result.description = result.description.slice(0, 100) + "...";
            result.description = highlightMatches(result.description, model.query);
            return result;
        })
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
                        totalSize: model.totalSize,
                        startIndex: model.startIndex,
                        endIndex: model.endIndex,
                        singlePage: pageNumbers.length <= 1
                    }));
                })
        });
});
