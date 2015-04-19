/*
 *  Sample collection of pageable results.
 */
var resultsStore = [{"title":"Avengers: Age of Ultron (2015-05-01)"},{"title":"Adult Beginners (2015-04-24)"},{"title":"The Age of Adaline (2015-04-24)"},{"title":"Hot Pursuit (2015-05-08)"},{"title":"Love (2015-05-01)"},{"title":"Skin Trade (2015-04-23)"},{"title":"Kamen Rider Gaim Gaiden (2015-04-22)"},{"title":"Kidnep (2015-04-22)"},{"title":"La Dame dans l'auto avec un fusil et des lunettes (2015-04-22)"},{"title":"Emptying the Skies (2015-04-22)"},{"title":"Our Kind of Traitor (2015-04-23)"},{"title":"Caprice (2015-04-22)"},{"title":"Entre amis (2015-04-22)"},{"title":"Härte (2015-04-23)"},{"title":"Hedi Schneider Is Stuck (2015-04-23)"},{"title":"Far from the Madding Crowd (2015-05-01)"},{"title":"The Diplomat (2015-04-23)"},{"title":"Sweet Lorraine (2015-04-23)"},{"title":"Private Number (2015-05-01)"},{"title":"Kampen om Klasserommet (2015-04-24)"},{"title":"Mühlheim – Texas. Helge Schneider hier und dort (2015-04-23)"},{"title":"WWE Extreme Rules 2015 (2015-04-26)"},{"title":"De Onde Eu Te Vejo (2015-04-23)"},{"title":"See You In Valhalla (2015-04-24)"},{"title":"Dum Laga Ke Haisha (2015-04-24)"}];


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
