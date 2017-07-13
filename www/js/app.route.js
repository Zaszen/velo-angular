var app = angular.module('app');

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        .state('home', {
            url: '/',
            controller: 'homeController',
            templateUrl: 'template/home.html'
        })

        .state('map', {
            url: '/map',
            controller: 'mapController',
            templateUrl: 'template/map.html'
        })
    
        
});