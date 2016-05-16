'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
  * @module  app
  * @description contain the details of post
*/

var appSchema = new Schema({

  appId: { type: Number, unique: true },

  appName: { type: String, required: true },

  appType: { type: String, required: true},

  link: { type: String, required: true },

  promotionalAppId : { type: [Number]},

  imageUrl : {type : String}
  
});



appSchema.statics.getAppList= function(callback) {
    this.find({},callback).sort({appId: 1});
};

appSchema.statics.getAppById= function(appId, callback) {
    this.findOne({ appId: appId } ,callback);
};

appSchema.statics.update = function(appId, updateObject, callback){
    this.findOneAndUpdate({appId: appId},updateObject, callback);
};

appSchema.statics.updateImage = function(appId, imageUrl, callback){
    this.findOneAndUpdate({appId: appId},{$set: {imageUrl : imageUrl}}, callback);
};


appSchema.statics.updatePromotionalAppId = function(appId, promotionalAppIdList, callback){
    this.findOneAndUpdate({appId: appId}, {promotionalAppId : promotionalAppIdList}, {returnNewDocument: true },callback);
};

appSchema.statics.getAppCampaign= function(promotionalAppId, callback) {
    this.find({appId: {$in: promotionalAppId}},{appId: 1, appName: 1, appType:1, link:1, imageUrl:1, _id: 0},callback).sort({appId: 1});
};

appSchema.statics.createApp = function(requestData, callback) {
    var that = this;
    this.find({},function(err, result){
      if(err){
        callback(err);
      } else{
        if(result.length){
          console.log(result);
          requestData.appId = ++(result[0].appId);
        } else{
          requestData.appId = 1;
        }
          that.create(requestData, callback);        
      }
    }).sort({appId: -1}).limit(1);
};


var app = mongoose.model('app', appSchema);

/** export schema */
module.exports = {
    app : app
};