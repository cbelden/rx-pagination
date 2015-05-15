# RxJS Pagination

This is a sample application that utilizes RxJS to respond to user events and update a paginated list of results.

RxJS is primarily employed to react to user events (by entering search terms or clicking a new page). Each user event produces a new page model, which is then rendered.

Additionally, I've implemented match-highlighting to help visualize how the search filter is operating.

Feel free to make a pull request if you see any improvements!

### Getting started
1. Clone the repository
2. `cd` to project root
2. Run `npm install`
3. Run `gulp bundle`
4. Navigate browser to pagination.html

### Tech used
* task runner: `gulp`
* templating: `handlebars`
* bundling: `browserify`
* handlebars transform: `hbsfy`
* DOM helper: `jQuery`
