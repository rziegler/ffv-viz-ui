'use strict';


angular.module('ffvApp.view2', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2/:dest', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', ['$scope', 'Config', '$routeParams', '$location', function ($scope, configService, $routeParams, $location) {

    function isNotEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    $scope.destinations = configService.getDestinations();
    $scope.days = configService.getDays();
    configService.setCurrentDestination($routeParams.dest);

    $scope.current = {
        destination: configService.getCurrentDestination(),
        day: $scope.days.values()[0]
    };

    if (isNotEmpty($scope.current.destination)) {
        $scope.current.destination = configService.getDestinationData().values()[0];
    }

    $scope.carriers = [];

    $scope.changeDestination = function (newDestination) {
        console.log(newDestination);
        $location.path('/view2/' + newDestination);
    }
    $scope.changeCarrier = function (newCarrier) {
        var event = jQuery.Event("change", {
            carrier: newCarrier,
            //            day: $scope.day
        });
        $("#carrier").trigger(event);
    }
    $scope.changeDay = function (newDay) {
        var event = jQuery.Event("change", {
            //            carrier: $scope.carrier,
            day: newDay
        });
        $("#weekday").trigger(event);
    }

    d3.csv("data/data-dest-" + $scope.current.destination.destination + ".csv".toLowerCase(), function (d) {
        //    d3.csv("data/data-dest-mad-small.csv".toLowerCase(), function (d) {
        return {
            destination: d.destination,
            origin: d.origin,
            carrier: d.carrier,
            flightNumber: d.flightNumber,
            departureDate: d.departureDate,
            departureTime: d.departureTime,
            departureWeekday: d.departureWeekday,
            requestDate: d.requestDate,
            deltaTime: +d.deltaTime,
            price: +d.pmin,
            bin: +d.binRanked
        };
    }, function (error, data) {
        if (error) throw error;

        var descendingIntStrings = function (a, b) {
            a = parseInt(a);
            b = parseInt(b);
            return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
        };

        var ascendingDateTimeStrings = function (a, b) {
            var dateTimeParser = d3.time.format("%Y-%m-%d %H:%M:%S");
            a = dateTimeParser.parse(a);
            b = dateTimeParser.parse(b);
            return d3.ascending(a, b);
        };

        /* ************************** */
        var allData = data;
        // FFV data (rearrange nested data so that the first level is an object and not an array)
        var nestedData = d3.nest()
            .key(function (d) {
                return d.carrier;
            })
            .key(function (d) {
                return d.departureDate + " " + d.departureTime;
            }).sortKeys(ascendingDateTimeStrings)
            .key(function (d) {
                return d.deltaTime;
            }).sortKeys(descendingIntStrings)
            .entries(data);

        var ffvData = new Object();
        nestedData.forEach(function (v) {
            ffvData[v.key] = v.values;
        });
        //        console.log(ffvData);

        function computeCarriers(data) {
            // carriers
            return d3.map(data,
                function (d) {
                    return d.carrier;
                }).keys();
        }

        function computeDeltaTimes(data) {
            // x-axis data -> delta times
            var deltaTimes = d3.map(data,
                function (d) {
                    return d.deltaTime;
                }).keys();
            // map into array with ints instead of Strings (keys() of map returns Strings)
            deltaTimes = $.map(deltaTimes, function (value, index) {
                return [parseInt(value)];
            });
            deltaTimes.sort(d3.descending);
            return deltaTimes;
        }

        $scope.carriers = computeCarriers(data);
        //        $scope.carrier = carriers[0]; // default carrier
        $scope.deltaTimes = computeDeltaTimes(data);
        $scope.$apply();


        doViz($scope.destination, $scope.destinations, $scope.days, allData, ffvData, $scope.deltaTimes, $scope.carriers);

    });


}]);