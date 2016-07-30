'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'environment',
  'configService',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).

config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({
        redirectTo: '/view1'
    });
}])

.config(function (envServiceProvider) {
    // set the domains and variables for each environment 
    envServiceProvider.config({
        domains: {
            development: ['localhost', 'dev.local'],
            production: ['ruth.threeit.ch']
        },
        vars: {
            development: {
                apiUrl: 'http://localhost:8080',
            },
            production: {
                apiUrl: 'http://ruth.threeit.ch',
            }
        }
    });
    envServiceProvider.check();
})


;