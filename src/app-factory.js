var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var rateLimit = require('express-rate-limit');
var path = require('path');
//var pg = require('pg');
//var util = require('util');
var winston = require('winston');

module.exports.createApp = function createApp() {
    var app = express();

    return Promise.resolve(app)
        .then(createLogger)
        //.then(setupEmailer)
        .then(setupRequestCallbacks)
        .then(setupMiddleware)
        //.then(waitForDatabaseConnection);
};

function createLogger(app) {
    app.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });

    app.logger.info("Creating App");

    return app;
}

function setupRequestCallbacks(app){
    // Setup our login rate limiting callback
    app.loginRateLimiter = new rateLimit({
        windowMs: 5 * 60 * 1000,  // How long to keep the record of requests in memory. Set to 5 minutes
        max: 5,                   // Max number of attempts
        delayAfter: 2,            // Begin slowing down responses after the 2nd request made by an IP
        delayMs: 1.0 * 1000,      // Slow down subsequent responses by another 1 second per request
        headers: true,            // Enable login rate headers
        message: "Too Many Login Attempts. Try Again in 5 Minutes"
    });
    app.logger.info("Setting up request callbacks");
    return app;
}

function setupMiddleware(app) {
    //Using static files such as client-side javascript, css, and html.
    app.use(express.static(path.join(__dirname + '/../public')));
    app.use(cors());

    //Using bodyParser in order to get variables from input data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.logger.info("Setting up middleware");
    return app;
}


/*
function waitForDatabaseConnection(app, connectionAttemptNumber = 1) {
    var MAX_CONNECTION_ATTEMPTS = 10;

    if (connectionAttemptNumber > MAX_CONNECTION_ATTEMPTS) {
        return Promise.reject('Too many connection attempts');
    }
    return connectDatabase(app)
        .catch(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, 10000);
            }).then(waitForDatabaseConnection.bind(null, app, connectionAttemptNumber + 1));
        });
}

function connectDatabase(app) {

    let conString;

    if (process.env.DATABASE_URL) {
        conString = process.env.DATABASE_URL;
    }
    else if (process.env.PGUSER &&
             process.env.PGPASSWORD &&
             process.env.PGHOST &&
             process.env.PGPORT &&
             process.env.PGDATABASE)
    {
        conString = util.format('postgresql://%s:%s@%s:%s/%s',
            process.env.PGUSER,
            process.env.PGPASSWORD,
            process.env.PGHOST,
            process.env.PGPORT,
            process.env.PGDATABASE);
    }
    else {
        app.logger.error("Database connect fail, missing environment variables");
        return Promise.reject('Environment variables to connect to the database must be set');
    }

    app.logger.info('Attempting to connect to postgres database at : ' + conString);
    app.database = new pg.Client(conString);

    return new Promise(function (resolve, reject) {
        return app.database.connect(function (err) {
            if (err) {
                app.logger.error(err);
                return reject(err);
            }

            app.logger.info("Database Connected");
            return resolve(app);
        });
    });
}
*/
