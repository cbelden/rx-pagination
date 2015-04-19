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
var filterUpdates = Rx.Observable.fromEvent(searchInput, 'keyup')
    .map(function (e) { return $(e.target).val(); })
    .map(tokenize)
    .map(search)
    .startWith({filter: function () { return true }, query: []});


/**
 *  Paging updates (ie when a user selects a new page). This pattern was found at
 *  https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/events.md to
 *  subsribe to events for dom elements that may/may not be present yet.
 */
var $pageLinks = $('.results-container');
var pagingUpdates = Rx.Observable.fromEventPattern(
    function addHandler (h) { $pageLinks.on('click', 'a', h)},
    function delHandler (h) { $pageLinks.off('click', 'a', h)})
    .map(function (e) {
        return parseInt($(e.target).text());
    })
    .startWith(1);

/**
 *  Combination of filter and paging updates (will capture any filtering/paging changes)
 */
var pageUpdates = filterUpdates
    .selectMany(function (search) {
        return pagingUpdates
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
var modelUpdates = pageUpdates
    .map(function (options) {
        var results = JSON.parse(JSON.stringify(resultsStore))
            .filter(function (result) {
                return options.filter(tokenize(result.title));
            });

        var numberOfPages = Math.ceil(results.length / options.pageSize);
        var pageNumbers = Rx.Observable
            .range(1, numberOfPages)
            .map(function (n) { return { number: n, active: options.page !== n }});

        // Return the page's model
        return {
            query: options.query,
            results: Rx.Observable.from(results),
            pageNumbers: pageNumbers,
            pageSize: options.pageSize,
            currentPage: options.page
        }
    });


/**
 * Subscribe to the model updates and re-render the page
 */
modelUpdates.subscribe(function render (model) {
    /* Render the results */
    paginate(model.results, model)
        .map(function (result) {
            result.title = highlightMatches(result.title, model.query);
            return result;
        })
        .toArray()
        .subscribe(function (results) {
            $('.results').html(templates.results({ results: results }));
        });


    /* Render the page numbers */
    model.pageNumbers
        .toArray()
        .subscribe(function (pageNumbers) {
            $('.page-numbers').html(templates.pageNumbers({ pageNumbers: pageNumbers }));
        });
});


/**
 * Pagination and Search
 */


function paginate (results, options) {
    return results
        .skip((options.currentPage - 1) * options.pageSize)
        .take(options.pageSize);
}


function tokenize (s) {
    if (!s) return [];

    return s.toLowerCase().split(' ');
}


function search (queryTokens) {
    return {
        filter: function (resultTokens) {
            if (!queryTokens) return true;

            /*
             * We're interested in results that have at least one token for each
             * query token that contains that query token.
             */
            return queryTokens.every(function (queryToken) {
                return resultTokens
                    .some(function (resultToken) {
                        return resultToken.indexOf(queryToken) !== -1;
                    });
            });
        },

        query: queryTokens
    };
}


/**
 * Rendering
 */


function buildPageNumbers (content, page) {
    if (page.active) {
        return content += '<li><a href="#">' + page.number + '</a></li>';
    }

    return content += '<li>' + page.number + '</li>';
}


function highlightMatches(term, queryTokens) {
    var resultTokens = term.split(' ');

    return resultTokens
        .map(function (resultToken) {
            var match = queryTokens
                .filter(function (queryToken) { return queryToken; })
                .map(function (queryToken) {
                    return {
                        index: resultToken.toLowerCase().indexOf(queryToken),
                        size: queryToken.length
                    }
                })
                .filter(function (match) { return match.index !== -1 })[0];

            if (match) {
                var left = resultToken.slice(0, match.index);
                var middle = resultToken.slice(match.index, match.index + match.size);
                var right = resultToken.slice(match.index + match.size);
                return left + '<span class="match">' + middle + '</span>' + right;
            }

            return resultToken;
        })
        .join(' ');
}
