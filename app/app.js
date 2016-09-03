'use strict';

// Declare app level module which depends on views, and components
angular.module('ffvApp', [
  'ui.bootstrap',
  'ngRoute',
  'ngSanitize',
  'ui.select',
  'environment',
  'configService',
  'ffvApp.view',
  'ffvApp.version'
]).

config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({
        redirectTo: '/view/ams'
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