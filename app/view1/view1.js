'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', [function () {

    var map = new Datamap({
        element: document.getElementById('map-container'),
        fills: {
            defaultFill: "#999",
            destinationCountry: '#ff5722'
        },
        data: {
            'USA': {
                fillKey: 'destinationCountry'
            },
            'THA': {
                fillKey: 'destinationCountry'
            },
            'ISL': {
                fillKey: 'destinationCountry'
            },
            'RUS': {
                fillKey: 'destinationCountry'
            },
            'ESP': {
                fillKey: 'destinationCountry'
            },
            'GBR': {
                fillKey: 'destinationCountry'
            },
            'JPN': {
                fillKey: 'destinationCountry'
            },
            'AUS': {
                fillKey: 'destinationCountry'
            },
            'BRA': {
                fillKey: 'destinationCountry'
            },
            'IND': {
                fillKey: 'destinationCountry'
            },
            'CHN': {
                fillKey: 'destinationCountry'
            },
            'NLD': {
                fillKey: 'destinationCountry'
            },
            'SRB': {
                fillKey: 'destinationCountry'
            },
            'ARE': {
                fillKey: 'destinationCountry'
            },
            'KOR': {
                fillKey: 'destinationCountry'
            },
            'TUR': {
                fillKey: 'destinationCountry'
            },
            'MLT': {
                fillKey: 'destinationCountry'
            },
            'GRC': {
                fillKey: 'destinationCountry'
            },
            'LTU': {
                fillKey: 'destinationCountry'
            },
            'SGP': {
                fillKey: 'destinationCountry'
            },
            'CAN': {
                fillKey: 'destinationCountry'
            }
        },
        geographyConfig: {
            highlightBorderColor: '#bada55',
            popupTemplate: function (geography, data) {
                console.log(data.key);
                return '<div class="hoverinfo">' + geography.properties.name + ' 
                Electoral Votes: ' +  data.electoralVotes + '
                '
            },
            highlightBorderWidth: 3
        }
        //        geographyConfig: {
        //            highlightOnHover: false,
        //            popupOnHover: true
        //        },

        //            setProjection: d3.geo.albers
    });
}]);