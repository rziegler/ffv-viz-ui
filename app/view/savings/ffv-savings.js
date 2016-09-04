function savingsViz($scope, configService, $location, $http, $q, loadType, deltaTime) {

    if (loadType == "static") {
        createSavingsVisualizationStatic();

    } else {
        createSavingsVisualizationOnline();
    }

    function createSavingsVisualizationStatic() {

    }

    function createSavingsVisualizationOnline() {

        // create two requests (minWeekdayFlight and minWeekdayBook) for every destination
        var requests = [];
        configService.getDestinationData().forEach(function (key, value) {
            requests.push($http.get("http://ffv.kows.info/api/savings/" + value.destination + "?delta=" + deltaTime));
        });

        // wait until all requests are done
        $q.all(requests).then(function (responses) {
            var map = d3.map([], function (d) {
                return d.destination;
            });

            var percent = d3.format(".2%");
            var number = d3.format(".2f");

            responses.forEach(function (d) {
                if (d.statusText === "OK") {
                    var separators = ['/', '\\\?'];
                    var urlSplitted = d.config.url.split(new RegExp(separators.join('|'), 'g'));
                    //                    console.log(urlSplitted[4] + " " + urlSplitted[5]);

                    // create new obj and add attributes
                    var dest = urlSplitted[5];
                    var obj = {};
                    obj.destination = configService.getDestinationDataForDestination(dest)
                    obj.savingAbs = number(d.data.absolut);
                    obj.savingRel = percent(d.data.relative);
                    obj.savings = configService.getSavingsForDestination(dest);

                    map.set(dest, obj);
                } else {
                    console.error(d);
                }
            });

            var data = map.values();
            console.log(map.values());

            $scope.savings = data;
            //            doParSetViz(data, ["Booking Weekday", "Destination", "Departure Weekday"], "Destination", $scope, configService)
        });
    }
}