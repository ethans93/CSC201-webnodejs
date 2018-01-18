var appFactory = require('../src/app-factory');

module.exports.createSiamClassicApp = function () {
    return appFactory.createApp()
        .then(mountUrlEndpoints);
};

function mountUrlEndpoints(app) {
    app.logger.info("Creating url endpoints");

    app.get('/', function (req, res) {
        res.sendFile('index.html');
    });

    return app;
}

