function parsetViz($scope, configService, $location, $http, $q, loadType, deltaTime) {

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
            d3.selectAll("path#Destination-" + destination).classed("selected", true);
        }
    });

    function createParSetVisualizationStatic() {
        // reading the csv
        d3.csv("data/flights-2.csv", function (error, data) {
            sortParSetData(data, "Booking Weekday");
            doParSetViz(data, ["Booking Weekday", "Destination", "Departure Weekday"], "Departure Weekday");
        });
    }

    function createParSetVisualizationOnline() {

        var labels = d3.map([
            {
                id: 'minWeekdayBook',
                label: 'Book on'
                  }, {
                id: 'minWeekdayFlight',
                label: 'Depart on'
                  }, {
                id: 'destination',
                label: 'Fly to'
                    //                  }, {
                    //                id: 'minhist',
                    //                label: 'Book weeks in advance'
                  }
              ], function (d) {
            return d.id;
        });

        // create two requests (minWeekdayFlight and minWeekdayBook) for every destination
        var requests = [];
        configService.getDestinationData().forEach(function (key, value) {
            requests.push($http.get("http://ffv.kows.info/api/minWeekdayFlight/" + value.destination + "?delta=" + deltaTime));
            requests.push($http.get("http://ffv.kows.info/api/minWeekdayBook/" + value.destination + "?delta=" + deltaTime));
            //            requests.push($http.get("http://ffv.kows.info/api/minhist/" + value.destination + "?delta=" + deltaTime));
        });

        // wait until all requests are done
        $q.all(requests).then(function (responses) {
            var map = d3.map([], function (d) {
                return d.destination;
            });

            responses.forEach(function (d) {
                if (d.statusText === "OK") {

                    //                    if (d.config.url.indexOf("minhist") !== -1) {
                    //                        var separators = ['/', '\\\?'];
                    //                        var urlSplitted = d.config.url.split(new RegExp(separators.join('|'), 'g'));
                    //                        var l = labels.get(urlSplitted[4]);
                    //
                    //                        var value = calculateWeekWithMaxMinFlights(d);
                    //
                    //                        if (map.has(urlSplitted[5])) {
                    //                            // get obj an add new attributes to existing obj
                    //                            var obj = map.get(urlSplitted[5]);
                    //
                    //                            obj[l.label] = calculateWeekWithMaxMinFlights(d);
                    //                            map.set(urlSplitted[5], obj);
                    //                        } else {
                    //                            // create new obj and add attributes
                    //                            var obj = {};
                    //                            obj[labels.get('destination').label] = urlSplitted[5];
                    //                            obj[l.label] = calculateWeekWithMaxMinFlights(d);
                    //                            map.set(urlSplitted[5], obj);
                    //                        }
                    //
                    //                    } else{
                    var separators = ['/', '\\\?'];
                    var urlSplitted = d.config.url.split(new RegExp(separators.join('|'), 'g'));
                    //                    console.log(urlSplitted[4] + " " + urlSplitted[5]);
                    var l = labels.get(urlSplitted[4]);

                    if (map.has(urlSplitted[5])) {
                        // get obj an add new attributes to existing obj
                        var obj = map.get(urlSplitted[5]);

                        obj[l.label] = configService.getFullDayForAbbr(d.data.value).name;
                        obj[l.label + "Probability"] = d.data.propability;
                        map.set(urlSplitted[5], obj);
                    } else {
                        // create new obj and add attributes
                        var obj = {};
                        obj[labels.get('destination').label] = urlSplitted[5];
                        obj[l.label] = configService.getFullDayForAbbr(d.data.value).name;
                        obj[l.label + "Probability"] = d.data.propability;
                        map.set(urlSplitted[5], obj);
                    }
                    //                    }
                } else {
                    console.error(d);
                }
            });

            var data = map.values();
            //            sortParSetData(data, "minWeekdayFlightValue");
            console.log(data);
            //            sortParSetData(data, "Booking Weekday");
            //            sortParSetData(data, "Departure Weekday");
            sortParSetData(data, "Depart on")
                //            doParSetViz(data, ["Booking Weekday", "Destination", "Departure Weekday", "Booking Week"], "Destination", $scope, configService)

            //            doParSetViz(data, ["Destination", "Departure Weekday", "Booking Weekday", "Booking Week"], "Destination", $scope, configService)


            //            doParSetViz(data, ["Fly to", "Depart on", "Book on", "Book weeks in advance"], "Fly to", $scope, configService)
            doParSetViz(data, ["Depart on", "Fly to", "Book on"], "Fly to", $scope, configService)
                //            doParSetViz(data, ["Fly to", "Book on", "Book weeks in advance", "Depart on"], "Fly to", $scope, configService)
                //            doParSetViz(data, ["Depart on", "Fly to", "Book on", "Book weeks in advance"], "Fly to", $scope, configService)
        });
    }

    function sortParSetData(data, sortBy) {
        // sort the data initially before starting to visualize
        function weekdayIdx(name) {
            switch (name) {
            case 'Monday':
                return 1;
            case 'Tuesday':
                return 2;
            case 'Wednesday':
                return 3;
            case 'Thursday':
                return 4;
            case 'Friday':
                return 5;
            case 'Saturday':
                return 6;
            case 'Sunday':
                return 7;
            default:
                // if it is not a weekday, use the name itself
                return name;
            }
        }

        data.sort(function (a, b) {
            return weekdayIdx(a[sortBy]) > weekdayIdx(b[sortBy]) ? 1 : -1;
        });

        //        data.sort(function (a, b) {
        //            if ((weekdayIdx(a["Booking Weekday"]) > weekdayIdx(b["Booking Weekday"])) == 0) {
        //                return a["Destination"] > b["Destionation"] ? 1 : -1;
        //            } else {
        //                return 0;
        //            };
        //        });
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

    function createTimeseriesVisualizationOnline() {
        // create a request (minhist) for every destination
        var requests = [];
        configService.getDestinationData().forEach(function (key, value) {
            requests.push($http.get("http://ffv.kows.info/api/minhist/" + value.destination + "?delta=" + deltaTime));
        });

        // wait until all requests are done
        $q.all(requests).then(function (responses) {
            var map = d3.map([], function (d) {
                return d.id;
            });

            responses.forEach(function (d) {
                if (d.statusText === "OK") {
                    // create new obj and add attributes
                    var separators = ['/', '\\\?'];
                    var urlSplitted = d.config.url.split(new RegExp(separators.join('|'), 'g'));
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
    }
}