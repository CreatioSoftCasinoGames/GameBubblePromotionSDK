'use strict';

var App = require('../model/app').app;
// var AWS = require('aws-sdk');
// AWS.config.update({ accessKeyId: "AKIAIE3YU2BL25HELO5A", secretAccessKey: "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" });
// AWS.config.region = 'ap-southeast-1';

exports.getImageUrl = function (req,res,next) {
  console.log("request.body is ",req.body);
  res.header("Access-Control-Allow-Origin", "*");
  // var s3 = new AWS.S3();
  // var urlParams = {Bucket: 'bubbleappimages', Key: req.body.fileName};
  // var s3Bucket = new AWS.S3( { params: {Bucket: 'bubbleappimages'} } )
  var imageurl = "https://s3-ap-southeast-1.amazonaws.com/promotionalimage/" + req.body.fileName;
  console.log("final image url is ",imageurl);
    App.updateImage(req.body.appId, imageurl, function(err,reponse) {
      if(err) {
        console.log("error occoured in uploading",err)
      } else {
        res.json({status: true, info: "uplaod done"});
      }
    })
  // s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
  //   console.log('the url of the image is', url);
  // })
};

/**
   GET: /app/appId
 */

exports.getByAppId = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    if( !req.params.appId ) return res.json({status: false, info: "Insufficient argument passed", error: null});
    App.getAppById(req.params.appId, function(err, result) {
      if (!err) {
          return res.json({status: true, result: result });
      } else {
          return res.json({status: false, info: "Opps something went wrong !!", error: err});
      }
    });
};

/**
   GET: /app
 */

exports.getAppList = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    App.getAppList(function(err, result) {
      if (!err) {
          return res.json({status: true, result: result });
      } else {
          return res.json({status: false, info: "Opps something went wrong !!", error: err});
      }
    });
};


/**
   POST: /app
 */

exports.create = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    if(!!req.body && !!req.body.appName && !!req.body.appType && !!req.body.link){
      App.createApp(req.body, function(err, data) {
          if (!err) {
            return res.json({status: true, info: "Sucessfully created", result: data });
          } else {
               if (11000 === err.code || 11001 === err.code) {
                  return res.json({status: false, info: "Duplicate entry found", error: err});
              }
              return res.json({status: false, info: "Opps something went wrong !!", error: err});
          }
      });      
    } else{
      return res.json({status: false, info: "Insufficient argument passed", error: null});
    }
};


/**
   PUT: /appPromotion/appId
 */

exports.updatePromotionalAppId = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("into updatePromotionalAppId -> ", req.body);
    if( !req.params.appId ) return res.json({status: false, info: "Insufficient argument passed", error: null});
    if(!!req.body && !!req.body.promotionalAppId){
        if(req.params.appId == req.body.promotionalAppId[(req.body.promotionalAppId.length-1)]){
            return res.json({status: false, info: "you can't add your own app to list !!", error: null});          
        } else{
          if(req.body.promotionalAppId.length == 0){
              App.updatePromotionalAppId(req.params.appId, req.body.promotionalAppId, function(err, data) {
                    if (!err) {
                      return res.json({status: true, info: "Sucessfully added campaign", result: data });
                    } else {
                         if (11000 === err.code || 11001 === err.code) {
                            return res.json({status: false, info: "Duplicate entry found", error: err});
                        }
                        console.log(err);
                        return res.json({status: false, info: "Opps something went wrong !!", error: err});
                    }
                });
          } else{
          App.getAppById(req.body.promotionalAppId[(req.body.promotionalAppId.length-1)], function(err, result){
            if (!err) {
              if(result){
                App.updatePromotionalAppId(req.params.appId, req.body.promotionalAppId, function(err, data) {
                    if (!err) {
                      return res.json({status: true, info: "Sucessfully added campaign", result: data });
                    } else {
                         if (11000 === err.code || 11001 === err.code) {
                            return res.json({status: false, info: "Duplicate entry found", error: err});
                        }
                        console.log(err);
                        return res.json({status: false, info: "Opps something went wrong !!", error: err});
                    }
                });
              } else{
                  return res.json({status: false, info: "Performing illegal operation", error: null});
              }
            } else {
                return res.json({status: false, info: "Opps something went wrong !!", error: err});
            }
          });
            
          }
        }

    } else{
      return res.json({status: false, info: "Insufficient argument passed", error: null});
    }
};

/**
   PUT: /app/appId
 */

exports.update = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("into update -> ", req.body);
    if( !req.params.appId ) return res.json({status: false, info: "Insufficient argument passed", error: null});
    if(!!req.body && !!req.body.appName && !!req.body.appType && !!req.body.link){
      if(req.body.appId || req.body.promotionalAppId) return res.json({status: false, info: "Performing illegal operation", error: null});
          App.update(req.params.appId, req.body, function(err, data) {
              if (!err) {
                return res.json({status: true, info: "Sucessfully updated", result: data });
              } else {
                   if (11000 === err.code || 11001 === err.code) {
                      return res.json({status: false, info: "Duplicate entry found", error: err});
                  }
                  return res.json({status: false, info: "Opps something went wrong !!", error: err});
              }
          });                


    } else{
      return res.json({status: false, info: "Insufficient argument passed", error: null});
    }
};

/**
   GET: /getAppCampaign/appId
 */

exports.getAppCampaign = function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    if( !req.params.appId ) return res.json({status: false, info: "Insufficient argument passed", error: null});
    App.getAppById(req.params.appId, function(err, result) {
      if (!err) {
          console.log(result.promotionalAppId);
          App.getAppCampaign(result.promotionalAppId, function(err, campaignlist){
             if(!err) {
                console.log("----campaignlist-----");
                console.log(campaignlist);
                console.log("-----result--------");
                console.log(result);
                result.promotionalAppId = campaignlist;
                return res.json({status: true, result: campaignlist });
             } else {
                return res.json({status: false, info: "Opps something went wrong !!", error: err});
            }
          });

      } else {
          return res.json({status: false, info: "Opps something went wrong !!", error: err});
      }
    });
};

