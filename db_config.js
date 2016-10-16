var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
    user: process.env.PGUSER || 'postgres', //env var: PGUSER
    database: process.env.PGDATABASE || 'anp', //env var: PGDATABASE
    password: process.env.PGPASSWORD || 'admin', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: process.env.PGPORT || 5432, //env var: PGPORT
    max: 40, // max number of clients in the pool
    idleTimeoutMillis: 2000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 2 seconds
//and set a limit of maximum 40 idle clients
var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
});

/**
 * Get all states from the database
 * return [{id:#, name:#}]
 */
module.exports.getStates = (function () {

    return function (callback) {

        pool.connect(function(err, client, done) {

            client.query('SELECT * from states order by id', function(err, result) {
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    return console.error('error running query', err);
                }

                callback(result);
            });

        })
    };

})();

/**
 * Get all cities related to a state
 * return [{id:#, name:#, code:#}]
 */
module.exports.getCitiesByStateId = (function () {

    return function (stateId, callback) {

        pool.connect(function(err, client, done) {

            client.query('SELECT c.id, c.name, c.code from cities c, states s where s.id = $1 and c.state_id = s.id order by s.id',
                [stateId], function(err, result) {
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    return console.error('error running query', err);
                }

                callback(result);
            });

        })
    };

})();

/**
 * Get all stations related to a city
 * return [{id:#, name:#, address:#, area:#, flag:#}]
 */
module.exports.getStationsByCityId = (function () {

    return function (cityId, callback) {

        pool.connect(function(err, client, done) {

            client.query('SELECT s.id, s.name, s.address, s.area, s.flag from stations s, cities c where c.id = $1 and s.city_id = c.id order by c.id',
                [cityId], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        return console.error('error running query', err);
                    }

                    callback(result);
                });

        })
    };

})();