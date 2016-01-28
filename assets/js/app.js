'use stric';

var tmi = angular.module('tmi',['ngResource', 'ngRoute', 'ngFileUpload']);

tmi.config(['$routeProvider', '$resourceProvider', function($routeProvider, $resourceProvider){

    $resourceProvider.defaults.stripTrailingSlashes = false;
    
    $routeProvider.when('/',{
        templateUrl:'/templates/home.html',
        controller:'HomeCtrl'
    }).otherwise({
        redirectTo: '/',
        caseInsensitiveMatch: true
    });
    
    //$routeProvider.otherwise;
    
}]).constant({
    API_URL:'/api/v1'
});