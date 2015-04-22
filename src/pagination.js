/**
 * Pagination and Search
 */

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


function paginate (results, options) {
   return results
           .skip((options.page - 1) * options.pageSize)
           .take(options.pageSize);
}


function tokenize (s) {
   if (!s) return [];
   return s.toLowerCase().split(' ');
}




/**
 * Highlighting
 */

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


module.exports = {
    search: search,
    tokenize: tokenize,
    paginate: paginate,
    highlightMatches: highlightMatches
};
