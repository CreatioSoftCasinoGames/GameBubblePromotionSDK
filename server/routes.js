'use strict';

// Load modules

var App = require('./controller/appController');

// API Server Endpoints
module.exports = function(app){

	app.route('/app')
		.post(App.create)
		.get(App.getAppList);

    app.route('/app/:appId')
    	.get(App.getByAppId)
        .put(App.update);

    app.route('/addAppToCampaign/:appId')
        .put(App.updatePromotionalAppId);

    app.route('/getAppCampaign/:appId')
    	.get(App.getAppCampaign);

    app.route('/getImageUrl')
    .post(App.getImageUrl);
}
