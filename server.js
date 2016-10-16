/**
 * Author: Lucas Monteiro
 * GitHub: https://github.com/lucasmonteiro001
 */
var app = require('./server_config');
var mid = require('./middlewares');
var db = require('./db_config');

// Escape and Trim every parameter
app.use(mid.escapeAndTrim);

app.get('/', function (req, res) {
    res.render('index.html'); // absolute path is inferred from pages/ folder (see at server_config.js)
});

app.get('/states', function (req, res) {

    db.getStates(function (states) {
        res.json(states.rows);
    });

});

app.get('/states/cities/:stateId', function (req, res) {

    db.getCitiesByStateId(req.param('stateId') || -1, function (states) {
        res.json(states.rows);
    });

});

app.get('/cities/stations/:cityId', function (req, res) {

    db.getStationsByCityId(req.param('cityId') || -1, function (states) {
        res.json(states.rows);
    });

});

app.get('/:short_url', function(req, res) {

    var short_url = req.param('short_url');
    var host = req.protocol + '://' + req.get('host') + '/';

    if(urls) {

        urls.findOne({short_url: host + short_url}).then(function(db_url) {

            // if no short_url was found, return an error
            if(db_url === null) {
                res.json({
                    error: "This url is not on the database."
                });
            }
            else { // If url found, redirect to the site
                console.log(db_url.url);
                res.redirect(db_url.url);
            }

        });
    }

    // res.json({s:short_url});
});

app.get('/new/*', function(req, res) {

    var urlRegex = "(https?:\/\/){1}[a-zA-Z0-9u00a1-\uffff0-]{2,}\\.[a-zA-Z0-9u00a1-\uffff0-]{2,}(\S*)";
    var url = req.params[0];
    var host = req.protocol + '://' + req.get('host') + '/';

    // If passed url is a valid url, save it to the database
    if(url.match(urlRegex) !== null) {

        if(urls) {
            // gets number of registers in the collection
            urls.find({}).count().then(function(count) {

                // searches if the url exists, if yes, returns it
                urls.findOne({url: url}).then(function(db_url) {

                    // If url is null, no document was found
                    if(db_url === null) {
                        // Insert a new register with the new count
                        urls.insert({ url: url,  short_url: host + (count + 1)}, function(err) {
                            if(err) {
                                console.error(err);
                            }
                            else {
                                res.json({
                                    original_url: url,
                                    short_url: host + (count + 1)
                                });
                            }
                        });
                    }
                    else { // if the url is in the database, return it
                        res.json({
                            original_url: url,
                            short_url: db_url.short_url
                        });
                    }

                });
            });
        }

    }
    else {
        res.json({
            error: "Wrong url format, make sure you have a valid protocol and real site."
        });
    }


});

/**
 * If route is not defined, return a message
 */
app.get('*', function(req, res, next){
    res.status(200).json({msg: "Invalid route"});
});
