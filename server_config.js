/**
 * Author: Lucas Monteiro
 * GitHub: https://github.com/lucasmonteiro001
 */
var express = require('express');

var app = express();

module.exports = app;

app.port = (process.env.PORT || 3000);

var cors = require('cors');

var bodyParser = require('body-parser');

/**
 * Allow access to request parameters e.g:req.param('nome do parametro')
 */
var requestParam = require('request-param');

/**
 * Packages that contains several validator methods
 */
var validator = require('validator');

/**
 * Asynchronous log library
 */
var winston = require('winston');

/**
 * Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app
 */
var compression = require('compression');

/**
 * Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers
 * https://www.npmjs.com/package/helmet
 * contentSecurityPolicy for setting Content Security Policy
 * dnsPrefetchControl controls browser DNS prefetching
 * frameguard to prevent clickjacking
 * hidePoweredBy to remove the X-Powered-By header
 * hpkp for HTTP Public Key Pinning
 * hsts for HTTP Strict Transport Security
 * ieNoOpen sets X-Download-Options for IE8+
 * noCache to disable client-side caching
 * noSniff to keep clients from sniffing the MIME type
 * xssFilter adds some small XSS protections
 */
var helmet = require('helmet');

var moment = require('moment');

var mid = require('./middlewares');

app.use(helmet());

app.use(mid.allowCors);

app.use(mid.logRequest);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

app.use(requestParam());

app.use(compression());

// Uses static files from pages/ folder
app.use(express.static('pages'));

//defini a porta na qual a aplicação irá responder
app.listen(app.port);

winston.info(moment().format('LTS') + ": " + 'Running webserver at port: ' + app.port);
