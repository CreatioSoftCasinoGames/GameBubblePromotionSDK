Classified.controller('RegisterController', ['$scope', '$http','$rootScope',  function($scope, $http,$rootScope) {
    $scope.create = function(){
        if(!$scope.data) alert("Please fill required field");
        else{
            var data = $scope.data;
            if(!data.appName){
                    alert("Please fill required field");
            }
            else{        
                $http.post("/app", data)
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
            }
        }
    }
}]);