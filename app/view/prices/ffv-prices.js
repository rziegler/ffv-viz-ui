function priceViz($scope, $uibModal, configService, $routeParams, $location, $http, loadType, deltaTime) {

    function isNotEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    $scope.destinations = configService.getDestinationData();
    $scope.days = configService.getDays();
    configService.setCurrentDestination($routeParams.dest.toUpperCase());

    $scope.current = {
        destination: configService.getCurrentDestination(),
        day: {
            name: "All weekdays"
        },
        carrier: "Carrier"
    };

    if (isNotEmpty($scope.current.destination)) {
        $scope.current.destination = configService.getDestinationData().values()[0];
    }

    $scope.carriers = [];

    var changeDestination = function (newDestination) {
        $location.path('/view/' + newDestination);
    }

    var changeCarrier = function (newCarrier) {
        var event = jQuery.Event("change", {
            carrier: newCarrier,
            //            day: $scope.day
        });
        $("#carrier").trigger(event);
    }
    var changeWeekday = function (newDay) {
        var event = jQuery.Event("change", {
            //            carrier: $scope.carrier,
            day: newDay
        });
        $("#weekday").trigger(event);
    }

    $scope.$watch("current.destination", function (newValue, oldValue) {
        //        console.log(oldValue.destination + " > " + newValue.destination);
        if (oldValue !== newValue) {
            //            console.log("updating destination to " + newValue.destination);
            changeDestination(newValue.destination);
        }
    });

    $scope.$watch("current.carrier", function (newValue, oldValue) {
        //        console.log(oldValue + " > " + newValue);
        if (oldValue !== newValue) {
            //            console.log("updating carrier to " + newValue);
            changeCarrier(newValue);
            //            $location.path('/view2/' + newValue.destination);
        }
    });

    $scope.$watch("current.day", function (newValue, oldValue) {
        //        console.log(oldValue.abbr + " > " + newValue.abbr);
        if (oldValue !== newValue) {
            //            console.log("updating weeekday to " + newValue);
            changeWeekday(newValue);
            //            $location.path('/view2/' + newValue.destination);
        }
    });

    // modal stuff
    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'sources.html',
            controller: 'ModalInstanceCtrl',
            size: size
        });
    };


    if (loadType == "static") {
        // reading the csv
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
            loadFlights(data);
            $scope.$apply();
        });
    } else {
        $http.get("http://ffv.kows.info/api/flights/" + $scope.current.destination.destination + "?delta=" + deltaTime).then(function (response) {
            loadFlights(response.data);
        });
    }


    function loadFlights(data) {

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

        $scope.loaded = true;
        doViz($scope.destination, $scope.destinations, $scope.days, allData, ffvData, $scope.deltaTimes, $scope.carriers);
    }

}