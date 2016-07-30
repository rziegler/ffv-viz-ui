'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', '$location', function ($scope, $location) {

    var destinationData = d3.map([
        {
            "countryCode": "USA",
            "destination": "JFK",
            "destinationName": "New York",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "THA",
            "destination": "BKK",
            "destinationName": "Bangkok",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "ISL",
            "destination": "KEF",
            "destinationName": "Reykjavik",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "RUS",
            "destination": "SVO",
            "destinationName": "Moscou",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "ESP",
            "destination": "MAD",
            "destinationName": "Madrid",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "GBR",
            "destination": "LHR",
            "destinationName": "London",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "JPN",
            "destination": "NRT",
            "destinationName": "Tokyo",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "BRA",
            "destination": "GRU",
            "destinationName": "Sao Paulo",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "IND",
            "destination": "BOM",
            "destinationName": "Mumbai",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "CHN",
            "destination": "PEK",
            "destinationName": "Beijing",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "NLD",
            "destination": "AMS",
            "destinationName": "Amsterdam",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "SRB",
            "destination": "BEG",
            "destinationName": "Belgrade",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "ARE",
            "destination": "DBX",
            "destinationName": "Dubai",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "KOR",
            "destination": "ICN",
            "destinationName": "Seoul",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "TUR",
            "destination": "IST",
            "destinationName": "Istanbul",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "MLT",
            "destination": "MLA",
            "destinationName": "Malta",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "GRC",
            "destination": "RHO",
            "destinationName": "Rhodes",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "LTU",
            "destination": "RIX",
            "destinationName": "Riga",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "SGP",
            "destination": "SIN",
            "destinationName": "Singapore",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        },
        {
            "countryCode": "CAN",
            "destination": "YYZ",
            "destinationName": "Toronto",
            "latitude": "",
            "longitude": "",
            "fillKey": "destinationCountryFill"
        }
    ], function (d) {
        return d.countryCode;
    });
    var map = new Datamap({
        element: document.getElementById('map-container'),
        responsive: false, // If true, call `resize()` on the map object when it should adjust it's size
        fills: {
            defaultFill: "#999",
            destinationCountryFill: '#ff5722'
        },
        data: {
            'USA': destinationData.get("USA"),
            'THA': destinationData.get("THA"),
            'ISL': destinationData.get("ISL"),
            'RUS': destinationData.get("RUS"),
            'ESP': destinationData.get("ESP"),
            'GBR': destinationData.get("GBR"),
            'JPN': destinationData.get("JPN"),
            'BRA': destinationData.get("BRA"),
            'IND': destinationData.get("IND"),
            'CHN': destinationData.get("CHN"),
            'NLD': destinationData.get("NLD"),
            'SRB': destinationData.get("SRB"),
            'ARE': destinationData.get("ARE"),
            'KOR': destinationData.get("KOR"),
            'TUR': destinationData.get("TUR"),
            'MLT': destinationData.get("MLT"),
            'GRC': destinationData.get("GRC"),
            'LTU': destinationData.get("LTU"),
            'SGP': destinationData.get("SGP"),
            'CAN': destinationData.get("CAN")
        },
        geographyConfig: {
            highlightBorderColor: '#fff',
            highlightBorderWidth: 1,
            highlightFillColor: function (data) {
                if (data.countryCode !== undefined) {
                    return '#ff7043';
                }
                return '#999';
            },
            popupTemplate: function (geo, data) {
                if (destinationData.has(data.countryCode)) {
                    return '<div class="hoverinfo"><b>' + data.destinationName + ' (' + data.destination + ')</b><br/>' + geo.properties.name + '</div>';
                }
            }
        },
        done: function (datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geo) {
                if (destinationData.has(geo.id)) {
                    $location.path('/view2');
                    console.log(geo.id);
                    $scope.$apply();
                }
            });
        }
    });
}]);