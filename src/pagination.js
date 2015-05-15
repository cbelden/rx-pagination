var Rx = require('rx');


if (typeof(Array.prototype.skip) != 'function') {
    Array.prototype.skip = function skip(n) {
        return this.slice(n);
    }
}


if (typeof(Array.prototype.take) != 'function') {
    Array.prototype.take = function take(n) {
        return this.slice(0, n);
    }
}


function paginate (options) {
   return {
       items: _filter(options),
       paging: _paging(options)
   };
}


function _filter (options) {
    return options.items
        .skip((options.page - 1) * options.pageSize)
        .take(options.pageSize);
}


function _paging (options) {
    var numberOfPages = Math.ceil(options.items.length / options.pageSize);
    var pageNumbers = [];
    for(var i = 1; i <= numberOfPages; i++) {
        pageNumbers.push({ number: i, active: options.page !== i});
    }

    var startIndex = (options.page - 1) * options.pageSize + 1;
    var endIndex = startIndex + options.pageSize - 1;
    if (endIndex > options.items.length) endIndex = options.items.length;

    return {
        totalSize: options.items.length,
        pageNumbers: pageNumbers,
        currentPage: options.page,
        startIndex: startIndex,
        endIndex: endIndex,
        singlePage: pageNumbers.length <= 1
    }
}


module.exports = {
    paginate: paginate,
    _filter: _filter,
    _paging: _paging
};
