#!/usr/bin/env node
'use strict';

require('../src/src').createSiamClassicApp()
    .then(function(app) {
        const PORT = 5000;
        const server = app.listen(PORT, function() {
            app.logger.info('Listening on port:', server.address().port);
        });
    })
    .catch(function(err) {
        console.error('Error creating app');
        console.error(new Date(), err);
        
        process.exit(1);
    });