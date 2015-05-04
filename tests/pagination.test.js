var paginate = require('pagination');

describe('pagination', function () {

    var paginate = pagianation.paginate;

    describe('paginate', function () {

        it('should get the first page of results', function () {
            var items = Rx.Observable.from([1, 2, 3, 4, 5]);
            var expected = Rx.Observable.from([1, 2]);
            var actual = paginate(items, { pageSize: 2, page: 1 });

            compareStreams(expected, actual);
        })
    });


    describe('search', function () {

    });


    describe('tokenize', function () {

    });


    describe('highlightMatches', function () {

    });

    function compareStreams(expected, actual) {
        var equals = expected.sequenceEqual(actual, function (actual, expected) {
            expect(actual).to.equal(expected);
        });

        equals.subscribe(function (result) {
            expect(result).to.be.ok;
        })
    }
});
