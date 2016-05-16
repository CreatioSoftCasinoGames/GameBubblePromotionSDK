

Classified.controller('ListController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {

    $scope.init = function(){
        $scope.label = "App List";
        $scope.isDisabled = true;
        $scope.appIds = [];
        $scope.showList = 1;

        $scope.appList = {};

        $http.get("/app")
            .success(function(res){
                if(res.status){
                    $scope.appList = res.result;
                    for(var i=0; i<$scope.appList.length; i++) {
                        $scope.appIds.push($scope.appList[i].appId);
                    }
                } else{
                    alert(res.info);
                }
            }).error(function(err){
                alert(err);
            });
    }

    $scope.edit = function(data){
        console.log(data);
        $scope.data = data;
        $scope.showList = 0;
        $scope.label = data.appName;

    }

    $scope.cancel = function(){
        $scope.showList = 1;
        $scope.label = "App List";
    }

    $scope.update = function(data){
        $scope.showList = 1;
        $scope.label = "App List";
        if(data.appName && data.appType && data.link){
            var requestObj = {}
            requestObj['appName'] = data.appName;
            requestObj['appType'] = data.appType;
            requestObj['link'] = data.link;

            if(data.appId != undefined){
                $http.put("/app/"+data.appId, requestObj)
                .success(function(res){
                    if(res.status){
                        alert(res.info);                        
                    } else{
                        alert(res.info);
                    }
                    $scope.data = {};
                }).error(function(err){
                    alert(err);
                });                
            } else{
                alert("Something fishy, retry !!");
            }          
        } else{
            alert("Please provide app name");
        }
    }

    $scope.add = function(campaignAppId, app){
        console.log(campaignAppId);
        console.log(app);
        if(campaignAppId != undefined && app.appId){
            var requestObj = {};
            requestObj['promotionalAppId'] = app.promotionalAppId;
            requestObj['promotionalAppId'].push(Number(campaignAppId));
            $http.put("/addAppToCampaign/"+app.appId, requestObj)
            .success(function(res){
                if(res.status){
                    alert(res.info);
                    $http.get("/app/"+app.appId)
                    .success(function(res){
                        if(res.status){
                            $scope.data = res.result;
                        } else{
                            alert(res.info);
                        }
                    }).error(function(err){
                        alert(err);
                    });                      
                } else{
                    alert(res.info);
                }
            }).error(function(err){
                alert(err);
            });                
        } else{
            alert("Something fishy, retry !!");
        } 
    }

    $scope.editPromotionalId = function() {
        $scope.isDisabled = false;
        console.log($scope.appList.promotionalAppId);
    }

    $scope.savePromotionalId = function(data,app) {
        $scope.isValid = true;
        var isFind=0;
        var array;
        console.log("data is",data);
        if(typeof data === "string") {
          array = data.split(",").map(Number);
          console.log("splited array is",array);
        } else {
          array = data;
        }
        if(array[0]==0){
          array = [];
        }
        for(var j=0;j<array.length;j++) {
          for(var i=0;i<$scope.appIds.length;i++) {
              //console.log($scope.appIds[i]);
              if(array[j] == $scope.appIds[i]){
                isFind++;
              }
          }
        }
        console.log("both lengths are  ", isFind, array.length);
        if(isFind === array.length) {
          $scope.isValid = true;
          var requestObj = {};
            requestObj['promotionalAppId'] = array;

           $http.put("/addAppToCampaign/"+app.appId, requestObj)
            .success(function(res){
                if(res.status){
                    alert(res.info);
                    $http.get("/app/"+app.appId)
                    .success(function(res){
                        if(res.status){
                            $scope.data = res.result;
                        } else{
                            alert(res.info);
                        }
                        $scope.isDisabled = true;
                    }).error(function(err){
                        alert(err);
                    });                      
                } else{
                    alert(res.info);
                }
            }).error(function(err){
                alert(err);
            });
        } else {
          alert("Please correct your entries");
          $scope.isDisabled = false;
        }
    }
$scope.init();

$scope.creds = {
  bucket: 'promotionalimage',
  access_key: 'AKIAJI75ADSOOM32D7HA',
  secret_key: 'P0ymSVW1ax6RbyetH0zkaAPlzBo0MX+cgv5QCMlO'
}
 $scope.showProgress = false
$scope.upload = function(data) {
  // Configure The S3 Object 
  $scope.showProgress = true;
  $scope.progressVal = 0;
  console.log("data in upload image is ",data);
  var appId = data.appId;
  console.log("file is ",$scope.file);
  AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
  AWS.config.region = 'ap-southeast-1';
  var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
 
  if($scope.file) {
    var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
 
    bucket.putObject(params, function(err, data) {
      if(err) {
        // There Was An Error With Your S3 Config
        alert(err.message);
        return false;
      }
      else {
        // Success!
        $scope.s3_path = $scope.creds.bucket + '/' + $scope.file.name;
        console.log("image url is ", $scope.s3_path);
        $scope.showProgress = false;
        alert('Upload Done');
        var requestObj = {
          fileName : $scope.file.name,
          appId: appId
        }
        console.log("requestObj is ",requestObj);
        $http.post("/getImageUrl", requestObj).success(function(res){
          console.log("image url is ",res);
        }).error(function(err){
          alert("err occureed while getting image url");
      });     
      }
    })
    .on('httpUploadProgress',function(progress) {
          // Log Progress Information
          progress = Math.round(progress.loaded / progress.total * 100) + '% done'
          //alert(progress);
          $scope.progressVal = progress
          console.log(progress);
        });
  }
  else {
    // No File Selected
    alert('No File Selected');
  }
}

}]);

Classified.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
});

