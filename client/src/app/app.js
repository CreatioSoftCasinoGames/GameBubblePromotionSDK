var Classified = angular.module('Classified', [

    'ngRoute'
    
]);

Classified.config(['$routeProvider','$locationProvider','$httpProvider', function ($routeProvider, $locationProvider,$httpProvider) {


	$routeProvider
	.when('/list', {
			templateUrl:'app/list/list.html',
			controller: 'ListController'
	})
    .when('/registerApp',{
    	templateUrl:'app/registerApp/register.html',
      	controller: 'RegisterController'
    })		
	.otherwise({
		redirectTo: '/list',
		
	});
		
}])

