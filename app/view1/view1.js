'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', '$location', 'Config', function ($scope, $location, configService) {

    var destinationData = configService.getDestinationData();
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
                    configService.setCurrentDestination(geo.id);
                    $location.path('/view2');
                    $scope.$apply();
                }
            });
        }
    });
}]);