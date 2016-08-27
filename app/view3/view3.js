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
    function getData(start, end, amount) {
        var data = [];
        for (var i = 0; i < amount; i++) {
            data.push({
                'value': (randomDate(start, end))
            })
        }
        return data;
    }
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

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).valueOf();
    }
    var amount = 100;
    if (window.innerWidth < 800)
        amount = 30;

    /* Create timeseries */
    console.log("create timeseries");
    var data = getData(new Date(2012, 1, 1), new Date(2015, 1, 2), amount);
    timeseries('timeseries one', data, true);

    console.log(data);
    var ffvdata = getFfvData();
    console.log(ffvdata);
    timeseriesFfv('timeseries ffv', ffvdata, true);

    timeseries('timeseries two', getData(new Date(2015, 1, 1), new Date(2015, 1, 2), amount), false);


}]);