'use strict';


angular.module('ffvApp.view3', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view3', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
    });
}])

.controller('View3Ctrl', ['$scope', '$uibModal', 'Config', '$location', '$http', function ($scope, $uibModal, configService, $location, $http) {

    doParSetViz();
    /* Generate random times between two dates */
    function getFfvData() {
        var data = [];
        configService.getDestinationData().forEach(function (key, value) {
            data.push({
                'id': key,
                'value': value.destinationName.length
            })
        });
        return data;
    }

    var ffvdata = getFfvData();
    console.log(ffvdata);
    timeseries('timeseries-vis', ffvdata, true);

}]);