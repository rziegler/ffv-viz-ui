'use strict';


angular.module('ffvApp.view2', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', ['$scope', 'Config', function ($scope, configService) {
    var current = configService.getCurrentDestination();
    console.log(current);
    $scope.destinationName = current.destinationName;
    $scope.destination = current.destination;


    doViz();
}]);