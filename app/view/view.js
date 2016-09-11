'use strict';


angular.module('ffvApp.view', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view/:dest', {
        templateUrl: 'view/view.html',
        controller: 'ViewCtrl'
    });
}])

.controller('ViewCtrl', ['$scope', '$uibModal', 'Config', '$routeParams', '$location', '$http', '$q', function ($scope, $uibModal, configService, $routeParams, $location, $http, $q) {

    var loadType = "online"; //static online
    var deltaTime = 49;

    parsetViz($scope, configService, $location, $http, $q, loadType, deltaTime);
    savingsViz($scope, configService, $location, $http, $q, loadType, deltaTime);
    priceViz($scope, $uibModal, configService, $routeParams, $location, $http, loadType, deltaTime);

    $scope.expanded = false; // set expaned initially to false

    $scope.expand = function () {
        // set the expaned property used for ng-class
        $scope.expanded = !$scope.expanded;
        calcExpandedHeight($scope.expanded);
    };

    // recalculate the height when filters change
    $('#tiles-chart').change(function (event) {
        jQuery(document).ready(function () { // wait until the svg is loaded
            calcExpandedHeight($scope.expanded);
        });
    });

    function calcExpandedHeight(isExpanded) {
        // calculated the expandedHeight for ng-style
        if (isExpanded) {
            var elem = $("#tiles-chart svg");
            var svgHeight = elem.get()[0].height.baseVal.value;
            console.log("expand height to " + svgHeight);
            $scope.expandedHeight = {
                'padding-bottom': svgHeight + "px"
            };
        } else {
            // reset padding
            $scope.expandedHeight = {};
        }
    }

}]);



angular.module('ffvApp.view').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };
});