/**
 *  Libararies
 */
 var Rx = require('rx');
 var $ = require('jQuery');


/*
 *  Sample collection of pageable results.
 */
var resultsStore = [{"title":"Avengers: Age of Ultron\n    (2015)","description":"When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and it is up to the Avengers to stop the villainous Ultron from enacting his terrible plans. (141 mins.)"},{"title":"Inside Out\n    (2015)","description":"After a girl moves to a new home, her emotions are plunged into chaos as they compete for control of her mind."},{"title":"Tomorrowland\n    (2015)","description":"Bound by a shared destiny, a teen bursting with scientific curiosity and a former boy-genius inventor embark on a mission to unearth the secrets of a place somewhere in time and space that exists in their collective memory."},{"title":"Jurassic World\n    (2015)","description":"Twenty-two years after the events of Jurassic Park, Isla Nublar now features a fully functioning dinosaur theme park, Jurassic World, as originally envisioned by John Hammond. After 10 years of operation and visitor rates declining, in order to fulfill a corporate mandate, a new attraction is created to re-spark visitor's interest, which backfires horribly."},{"title":"Mad Max: Fury Road\n    (2015)","description":"In a post-apocalyptic world, in which people fight to the death, Max teams up with a mysterious woman, Furiousa, to try and survive."},{"title":"Mission: Impossible - Rogue Nation\n    (2015)","description":"Ethan and team take on their most impossible mission yet, eradicating the Syndicate - an International rogue organization as highly skilled as they are, committed to destroying the IMF."},{"title":"Ant-Man\n    (2015)","description":"Armed with a super-suit with the astonishing ability to shrink in scale but increase in strength, con-man Scott Lang must embrace his inner hero and help his mentor, Dr. Hank Pym, plan and pull off a heist that will save the world."},{"title":"Fantastic Four\n    (2015)","description":"Four young scientists achieve superhuman abilities through a teleportation experiment gone haywire. They must now use these abilities to save the world from an uprising tyrant."},{"title":"The Man from U.N.C.L.E.\n    (2015)","description":"In the early 1960s, CIA agent Napoleon Solo and KGB operative Illya Kuryakin participate in a joint mission against a mysterious criminal organization, which is working to proliferate nuclear weapons."},{"title":"Minions\n    (2015)","description":"Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world."},{"title":"Pan\n    (2015)","description":"The story of an orphan who is spirited away to the magical Neverland. There, he finds both fun and dangers, and ultimately discovers his destiny -- to become the hero who will be forever known as Peter Pan."},{"title":"Pitch Perfect 2\n    (2015)","description":"A collegiate a cappella group called the Barden Bellas enter into an international competition that no American team has ever won before."},{"title":"Terminator Genisys\n    (2015)","description":"After finding himself in a new time-line, Kyle Reese teams up with John Connor's mother Sarah and an aging terminator to try and stop the one thing that the future fears, \"Judgement Day\"."},{"title":"Aloha\n    (2015)","description":"A celebrated military contractor returns to the site of his greatest career triumphs and re-connects with a long-ago love while unexpectedly falling for the hard-charging Air Force watchdog assigned to him."},{"title":"San Andreas\n    (2015)","description":"In the aftermath of a massive earthquake in California, a rescue-chopper pilot makes a dangerous journey across the state in order to rescue his estranged daughter."},{"title":"Mr. Holmes\n    (2015)","description":"An aged, retired Sherlock Holmes looks back on his life, and grapples with an unsolved case involving a beautiful woman. (103 mins.)"},{"title":"Ricki and the Flash\n    (2015)","description":"A guitar player returns home to make amends with her family."},{"title":"Entourage\n    (2015)","description":"Movie star Vincent Chase, together with his boys Eric, Turtle, and Johnny, are back - and back in business with super agent-turned-studio head Ari Gold."},{"title":"Southpaw\n    (2015)","description":"A boxer fights his way to the top, only to find his life falling apart around him."},{"title":"Paper Towns\n    (2015)","description":"A young man and his friends embark upon the road trip of their lives to find the missing girl next door."},{"title":"Self/less\n    (2015)","description":"An extremely wealthy man, dying from cancer, undergoes a radical medical procedure that transfers his..."},{"title":"Me and Earl and the Dying Girl\n    (2015)","description":"A teenage filmmaker befriends a classmate with cancer. (104 mins.)"},{"title":"Regression\n    (2015)","description":"A father is accused of a crime he has no memory of committing."},{"title":"Pixels\n    (2015)","description":"When aliens misinterpret video feeds of classic arcade games as a declaration of war, they attack the Earth in the form of the video games."},{"title":"Vacation\n    (2015)","description":"Rusty Griswold takes his own family on a road trip to \"Walley World\" in order to spice things up with his wife and reconnect with his sons."},{"title":"Slow West\n    (2015)","description":"'Slow West' follows a 16-year-old boy on a journey across 19th Century frontier America in search of the woman he loves... (84 mins.)"},{"title":"Before I Wake\n    (2015)","description":"A young couple adopt an orphaned child whose dreams - and nightmares - manifest physically as he sleeps."},{"title":"Ted 2\n    (2015)","description":"Newlywed couple Ted and Tami-Lynn want to have a baby, but in order to qualify to be a parent, Ted will have to prove he's a person in a court of law."},{"title":"Trainwreck\n    (2015)","description":"Having thought that monogamy was never possible, a commitment-phobic career woman may have to face her fears when she meets a good guy. (122 mins.)"},{"title":"Magic Mike XXL\n    (2015)","description":"The continuing story of male stripper, Magic Mike."},{"title":"Straight Outta Compton\n    (2015)","description":"The group NWA emerges from the streets of Compton, California in the mid-1980s and revolutionizes pop culture with their music and tales about life in the hood."},{"title":"Masterminds\n    (2015)","description":"A night guard at an armored car company in the Southern U.S. organizes one of the biggest bank heists in American history."},{"title":"Poltergeist\n    (2015)","description":"A family's suburban home is invaded by evil forces."},{"title":"Maggie\n    (2015)","description":"A teenage girl in the Midwest becomes infected by an outbreak of a disease that slowly turns the infected into cannibalistic zombies. During her transformation, her loving father stays by her side. (95 mins.)"},{"title":"Spy\n    (2015)","description":"A desk-bound CIA analyst volunteers to go undercover to infiltrate the world of a deadly arms dealer, and prevent diabolical global disaster. (120 mins.)"},{"title":"Far from the Madding Crowd\n    (2015)","description":"In Victorian England, the independent and headstrong Bathsheba Everdene attracts three very different suitors: Gabriel Oak, a sheep farmer; Frank Troy, a reckless Sergeant; and William Boldwood, a prosperous and mature bachelor. (119 mins.)"},{"title":"The End of the Tour\n    (2015)","description":"A magazine reporter recounts his travels and conversations with author David Foster Wallace during a promotional book tour. (106 mins.)"},{"title":"Insidious: Chapter 3\n    (2015)","description":"A prequel set before the haunting of the Lambert family that reveals how gifted psychic Elise Rainier reluctantly agrees to use her ability to contact the dead in order to help a teenage girl who has been targeted by a dangerous supernatural entity."},{"title":"Max\n    (2015)","description":"A dog that helped US Marines in Afghanistan returns to the U.S. and is adopted by his handler's family after suffering a traumatic experience. (111 mins.)"},{"title":"The Gift\n    (2015)","description":"A young married couple's lives are thrown into a harrowing tailspin when an acquaintance from the husband's past brings mysterious gifts and a horrifying secret to light after more than 20 years."},{"title":"Hot Pursuit\n    (2015)","description":"An inept police officer must protect the widow of a drug dealer from criminals and dirty policemen."},{"title":"Sinister 2\n    (2015)","description":"A young mother and her twin sons move into a rural house that's marked for death."},{"title":"The D Train\n    (2015)","description":"The head of a high school reunion committee travels to Los Angeles to track down the most popular guy from his graduating class and convince him to go to the reunion. (97 mins.)"},{"title":"5 Flights Up\n    (2014)","description":"A long-time married couple who've spent their lives together in the same New York apartment become overwhelmed by personal and real estate-related issues when they plan to move away. (92 mins.)"},{"title":"Hitman: Agent 47\n    (2015)","description":"An assassin teams up with a woman to help her find her father and uncover the mysteries of her ancestry."},{"title":"Criminal\n    (2015)","description":"The memories & skills of a deceased CIA agent are implanted into an unpredictable and dangerous convict."},{"title":"Dope\n    (2015)","description":"A coming of age comedy/drama for the post hip hop generation. Malcolm is a geek, carefully surviving life in The Bottoms... (115 mins.)"},{"title":"The Bronze\n    (2015)","description":"A foul-mouthed former gymnastics bronze medalist must fight for her local celebrity status when a new young athlete's star rises in town. (108 mins.)"},{"title":"Irrational Man\n    (2015)","description":"On a small town college campus, a philosophy professor in existential crisis gives his life new purpose when he enters into a relationship with his student."},{"title":"Welcome to Me\n    (2014)","description":"A year in the life of Alice Klieg, a woman with Borderline Personality Disorder who wins Mega-millions, quits her meds and buys her own talk show. (105 mins.)"}];


/*
 *  Page size
 */
 var PAGE_SIZE = 10;

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
                        pageSize: PAGE_SIZE,
                        query: search.query
                    }
                })
                .startWith({filter: search.filter, query: [], page: 1, pageSize: PAGE_SIZE});
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
