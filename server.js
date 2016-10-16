/**
 * Author: Lucas Monteiro
 * GitHub: https://github.com/lucasmonteiro001
 */
var app = require('./server_config');
var mid = require('./middlewares');
var db = require('./db_config');

// Escape and Trim every parameter
app.use(mid.escapeAndTrim);
app.use(mid.allowCors);

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

/**
 * If route is not defined, return a message
 */
app.get('*', function(req, res, next){
    res.status(200).json({msg: "Invalid route"});
});
