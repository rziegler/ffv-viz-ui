'use strict';


angular.module('ffvApp.view3', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view3', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
    });
}])

.controller('View3Ctrl', ['$scope', '$uibModal', 'Config', '$location', '$http', '$q', function ($scope, $uibModal, configService, $location, $http, $q) {

    var loadType = "online"; // online static

    if (loadType == "static") {
        createParSetVisualizationStatic();
        createTimeseriesVisualizationStatic();

    } else {
        createParSetVisualizationOnline();
        createTimeseriesVisualizationOnline();

    }

    $scope.$on('hightlightDestinationOnParsetVis', function (event, destination) {
        //        console.log("hightlightDestinationOnParsetVis > " + destination);
        d3.selectAll(".circ.active").classed("active", false);
        if (destination !== '') {
            d3.selectAll(".circ." + destination.toLowerCase()).classed("active", true);
        }
    });

    $scope.$on('hightlightDestinationOnTimeseriesVis', function (event, destination) {
        //        console.log("hightlightDestinationOnTimeseriesVis > " + destination);
        if (destination === '') {
            d3.selectAll(".ribbon path").classed("selected", false);
        } else {
            d3.selectAll("path#destination-" + destination).classed("selected", true);
        }
    });

    function createParSetVisualizationStatic() {
        // reading the csv
        d3.csv("data/flights.csv", function (error, data) {
            console.log(data);
            doParSetViz(data, ["Booking Weekday", "Destination", "Departure Weekday"], "Departure Weekday");
        });
    }

    function createParSetVisualizationOnline() {
        // create two requests (minWeekdayFlight and minWeekdayBook) for every destination
        var requests = [];
        configService.getDestinationData().forEach(function (key, value) {
            requests.push($http.get("http://ffv.kows.info/api/minWeekdayFlight/" + value.destination));
            requests.push($http.get("http://ffv.kows.info/api/minWeekdayBook/" + value.destination));
        });

        // wait until all requests are done
        $q.all(requests).then(function (responses) {
            var map = d3.map([], function (d) {
                return d.destination;
            });

            responses.forEach(function (d) {
                if (d.statusText === "OK") {
                    var urlSplitted = d.config.url.split("/");
                    //                    console.log(urlSplitted[4] + " " + urlSplitted[5]);

                    if (map.has(urlSplitted[5])) {
                        // get obj an add new attributes to existing obj
                        var obj = map.get(urlSplitted[5]);
                        obj[urlSplitted[4] + "Value"] = d.data.value;
                        obj[urlSplitted[4] + "Probability"] = d.data.propability;
                        map.set(urlSplitted[5], obj);
                    } else {
                        // create new obj and add attributes
                        var obj = {
                            "destination": urlSplitted[5]
                        };
                        obj[urlSplitted[4] + "Value"] = d.data.value;
                        obj[urlSplitted[4] + "Probability"] = d.data.propability;
                        map.set(urlSplitted[5], obj);
                    }
                } else {
                    console.error(d);
                }
            });
            doParSetViz(map.values(), ["minWeekdayBookValue", "destination", "minWeekdayFlightValue"], "destination", $scope)
        });
    }

    function createTimeseriesVisualizationStatic() {
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
        timeseries('timeseries', ffvdata, 'Booking week', 960, $scope);
    }

    function createTimeseriesVisualizationOnline() {
        // create a request (minhist) for every destination
        var requests = [];
        configService.getDestinationData().forEach(function (key, value) {
            requests.push($http.get("http://ffv.kows.info/api/minhist/" + value.destination));
        });

        // wait until all requests are done
        $q.all(requests).then(function (responses) {
            var map = d3.map([], function (d) {
                return d.id;
            });

            responses.forEach(function (d) {
                if (d.statusText === "OK") {
                    // create new obj and add attributes
                    var urlSplitted = d.config.url.split("/");
                    var obj = {
                        "id": urlSplitted[5],
                        "value": calculateWeekWithMaxMinFlights(d)
                    };
                    map.set(urlSplitted[5], obj);
                } else {
                    console.error(d);
                }
            });
            //    timeseries('timeseries', map.values(), 'Weeks before flight to book', 960);
            timeseries('timeseries', map.values(), 'Booking week', 960, $scope);
        });

        function calculateWeekWithMaxMinFlights(d) {
            var cheapestFlightsPerWeek = [];
            for (var i = 0; i < d.data.length; i = i + 7) {
                var sumForWeek = 0;
                for (var j = i; j < i + 7; j++) {
                    sumForWeek += d.data[j];
                }
                cheapestFlightsPerWeek.push(sumForWeek);
            }
            // reverse to be able to use the index as delta week before flight
            cheapestFlightsPerWeek.reverse();

            // get the index of the max value
            var max = d3.max(cheapestFlightsPerWeek);
            var maxIndex = -1;
            for (var i = 0; i < cheapestFlightsPerWeek.length; i++) {
                if (cheapestFlightsPerWeek[i] === max) {
                    maxIndex = i;
                    break;
                }
            }
            //                    console.log(cheapestFlightsPerWeek + " > " + maxIndex);
            return maxIndex + 1; // +1 since the array index is 0-based
        }
    }



}]);