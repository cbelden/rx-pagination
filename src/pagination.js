var Rx = require('rx');


function paginate (options) {
    var items = options.items;

    if (typeof items.length == 'number') {
        items = Rx.Observable.from(items);
    }

   return items
           .skip((options.page - 1) * options.pageSize)
           .take(options.pageSize);
}


module.exports = {
    paginate: paginate
};
