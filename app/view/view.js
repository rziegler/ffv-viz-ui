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
    priceViz($scope, $uibModal, configService, $routeParams, $location, $http, loadType, deltaTime);



}]);

angular.module('ffvApp.view').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };
});