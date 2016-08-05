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
    $scope.destinationName = current.destinationName;
    $scope.destination = current.destination;

    if ($scope.destination == undefined) {
        $scope.destinationName = 'Amsterdam';
        $scope.destination = 'AMS';
    }

    doViz($scope.destination);

    // Initialize collapse button
    $(".button-collapse").sideNav({
        menuWidth: 360, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //    $('.collapsible').collapsible();

}]);