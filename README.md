# RxJS Pagination

This is a sample application that utilizes RxJS to respond to user events and update a paginated list of results.

Users can click page numbers or enter a query to update the paginated list. The search bar does not affect the order of results, however it filters out all results that do not contain all of the search terms.

Adding additional user inputs would consist of creating a new input stream and combining it with the existing input streams and updating the resulting page model accordingly.

Additionally, I've implemented match-highlighting to help visualize how the search filter is operating.

Feel free to make a pull request if you see any improvements!

### Running
1. Clone the repository
2. `cd` to project root
2. Run `npm install`
3. Run `gulp bundle`
4. Open pagination.html in the browser

### Tech used
* task runner: `gulp`
* templating: `handlebars`
* bundling: `browserify`
* handlebars transform: `hbsfy`
* DOM: `jQuery`
