/*
 *  Sample collection of pageable results.
 */
var resultsStore = [{"title":"Avengers: Age of Ultron\n    (2015)"},{"title":"Inside Out\n    (2015)"},{"title":"Tomorrowland\n    (2015)"},{"title":"Jurassic World\n    (2015)"},{"title":"Mad Max: Fury Road\n    (2015)"},{"title":"Mission: Impossible - Rogue Nation\n    (2015)"},{"title":"Ant-Man\n    (2015)"},{"title":"Fantastic Four\n    (2015)"},{"title":"The Man from U.N.C.L.E.\n    (2015)"},{"title":"Minions\n    (2015)"},{"title":"Pan\n    (2015)"},{"title":"Pitch Perfect 2\n    (2015)"},{"title":"Terminator Genisys\n    (2015)"},{"title":"Aloha\n    (2015)"},{"title":"San Andreas\n    (2015)"},{"title":"Mr. Holmes\n    (2015)"},{"title":"Ricki and the Flash\n    (2015)"},{"title":"Entourage\n    (2015)"},{"title":"Southpaw\n    (2015)"},{"title":"Paper Towns\n    (2015)"},{"title":"Self/less\n    (2015)"},{"title":"Me and Earl and the Dying Girl\n    (2015)"},{"title":"Regression\n    (2015)"},{"title":"Pixels\n    (2015)"},{"title":"Vacation\n    (2015)"},{"title":"Slow West\n    (2015)"},{"title":"Before I Wake\n    (2015)"},{"title":"Ted 2\n    (2015)"},{"title":"Trainwreck\n    (2015)"},{"title":"Magic Mike XXL\n    (2015)"},{"title":"Straight Outta Compton\n    (2015)"},{"title":"Masterminds\n    (2015)"},{"title":"Poltergeist\n    (2015)"},{"title":"Maggie\n    (2015)"},{"title":"Spy\n    (2015)"},{"title":"Far from the Madding Crowd\n    (2015)"},{"title":"The End of the Tour\n    (2015)"},{"title":"Insidious: Chapter 3\n    (2015)"},{"title":"Max\n    (2015)"},{"title":"The Gift\n    (2015)"},{"title":"Hot Pursuit\n    (2015)"},{"title":"Sinister 2\n    (2015)"},{"title":"The D Train\n    (2015)"},{"title":"5 Flights Up\n    (2014)"},{"title":"Hitman: Agent 47\n    (2015)"},{"title":"Criminal\n    (2015)"},{"title":"Dope\n    (2015)"},{"title":"The Bronze\n    (2015)"},{"title":"Irrational Man\n    (2015)"},{"title":"Welcome to Me\n    (2014)"}]


$(document).ready(function () {
    /*
     *  Filter updates (ie when a user enters new text in the search box)
     */
    var searchInput = document.getElementById('search');
    var filterUpdates = Rx.Observable.fromEvent(searchInput, 'keyup')
        .map(function (e) { return $(e.target).val(); })
        .map(tokenize)
        .map(search)
        .startWith({filter: function () { return true }, query: []});


    /*
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

    /*
     *  Combination of filter and paging updates (will capture any filtering/paging changes)
     */
    var pageUpdates = filterUpdates
        .selectMany(function (search) {
            return pagingUpdates
                .map(function (page) {
                    return {
                        filter: search.filter,
                        page: page,
                        pageSize: 6,
                        query: search.query
                    }
                })
                .startWith({filter: search.filter, query: [], page: 1, pageSize: 6});
        });


    /*
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


    /*
     * Subscribe to the model updates and re-render the page
     */
    modelUpdates.subscribe(function render (model) {
        /* Render the results */
        paginate(model.results, model)
            .map(function (result) {
                result.title = highlightMatches(result.title, model.query);
                return result;
            })
            .scan('', buildPosts)
            .subscribe(populateContent('.results'));


        /* Render the page numbers */
        model.pageNumbers
            .scan('', buildPageNumbers)
            .subscribe(populateContent('.page-numbers'));
    });


    /*
     * Pagination and Search
     * ***********************
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


    /*
     * Rendering
     * ***********************
     */


    function populateContent (selector) {
        return function (content) {
            $(selector)
                .empty()
                .append(content);
        }
    }


    function buildPosts (content, post) {
        return content += '<div class="result">' + post.title + '</div>';
    }


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
});
