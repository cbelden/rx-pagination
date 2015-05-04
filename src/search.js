/**
 * Returns a true/false search function that evaluates the tokenized input
 * against the provided queryTerms.
 */
function search (queryTerms) {
    return {
        filter: function (targetTerms) {
            if (!targetTerms) return true;

            /*
             * We're interested in results that have at least one term for each
             * query token that contains that query token.
             */
            return queryTerms.every(function (queryTerm) {
                return targetTerms
                    .some(function (targetTerm) {
                        return targetTerm.indexOf(queryTerm) !== -1;
                    });
            });
        },

        query: queryTerms
    };
}


/**
 * Wraps any matching tokens with a span.
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


/**
 * Splits a string on white space.
 */
function tokenize (s) {
   if (!s) return [];
   return s.toLowerCase().split(' ');
}

module.exports = {
    search: search,
    highlightMatches: highlightMatches,
    tokenize: tokenize
};
