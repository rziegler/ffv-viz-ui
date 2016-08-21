'use strict';

var configService = angular.module('configService', ['ngResource']);

configService.factory('Config', ['$resource', 'envService',
  function ($resource, envService) {
        var apiUrl = envService.read('apiUrl');

        //        var Tenses = $resource(apiUrl + '/api/tenses', {}, {
        //            query: {
        //                method: 'GET',
        //                isArray: true
        //            }
        //        });
        //
        //        var tenses = Tenses.query();
        //        tenses.$promise.then(function (response) {
        //            console.log('tenses loaded');
        //            tenses = response;
        //        }).catch(function () {
        //            console.log('error fetching tenses');
        //        })

        /* Shared data */
        var destinationData = d3.map([
            {
                "countryCode": "ISL",
                "type": "Europe",
                "destination": "KEF",
                "destinationName": "Reykjavik",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "RUS",
                "type": "Europe",
                "destination": "SVO",
                "destinationName": "Moscou",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "USA",
                "type": "Oversea",
                "destination": "JFK",
                "destinationName": "New York",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
         },
            {
                "countryCode": "THA",
                "type": "Oversea",
                "destination": "BKK",
                "destinationName": "Bangkok",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "ESP",
                "type": "Europe",
                "destination": "MAD",
                "destinationName": "Madrid",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "GBR",
                "type": "Europe",
                "destination": "LHR",
                "destinationName": "London",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "JPN",
                "type": "Oversea",
                "destination": "NRT",
                "destinationName": "Tokyo",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "BRA",
                "type": "Oversea",
                "destination": "GRU",
                "destinationName": "Sao Paulo",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "IND",
                "type": "Oversea",
                "destination": "BOM",
                "destinationName": "Mumbai",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "CHN",
                "type": "Oversea",
                "destination": "PEK",
                "destinationName": "Beijing",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "NLD",
                "type": "Europe",
                "destination": "AMS",
                "destinationName": "Amsterdam",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "SRB",
                "type": "Europe",
                "destination": "BEG",
                "destinationName": "Belgrade",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "ARE",
                "type": "Oversea",
                "destination": "DXB",
                "destinationName": "Dubai",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "KOR",
                "type": "Oversea",
                "destination": "ICN",
                "destinationName": "Seoul",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "TUR",
                "type": "Europe",
                "destination": "IST",
                "destinationName": "Istanbul",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "MLT",
                "type": "Europe",
                "destination": "MLA",
                "destinationName": "Malta",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "GRC",
                "type": "Europe",
                "destination": "RHO",
                "destinationName": "Rhodes",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "LTU",
                "type": "Europe",
                "destination": "RIX",
                "destinationName": "Riga",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "SGP",
                "type": "Oversea",
                "destination": "SIN",
                "destinationName": "Singapore",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        },
            {
                "countryCode": "CAN",
                "type": "Oversea",
                "destination": "YYZ",
                "destinationName": "Toronto",
                "latitude": "",
                "longitude": "",
                "fillKey": "destinationCountryFill"
        }
    ], function (d) {
            return d.countryCode;
        });

        var currentDestination = {}; // empty object

        /* Accessor functions for shared data */
        var getDestinationData = function () {
            return destinationData;
        };

        var getCurrentDestination = function () {
            return currentDestination;
        }

        var setCurrentDestinationByCountry = function (id) {
            currentDestination = destinationData.get(id);
        }

        var setCurrentDestination = function (destCode) {
            destinationData.values().forEach(function (entry) {
                if (entry.destination == destCode) {
                    currentDestination = entry;
                }
            });
        }

        function getDays() {
            return d3.map([
                {
                    name: 'All weekdays',
                    abbr: 'all',
                    abbrGerman: 'all',
                    idx: -1
                  }, {
                    name: 'Monday',
                    abbr: 'Mo',
                    abbrGerman: 'Mo',
                    idx: 0
                  },
                {
                    name: 'Tuesday',
                    abbr: 'Tu',
                    abbrGerman: 'Di',
                    idx: 1
                  },
                {
                    name: 'Wednesday',
                    abbr: 'We',
                    abbrGerman: 'Mi',
                    idx: 2
                  },
                {
                    name: 'Thursday',
                    abbr: 'Th',
                    abbrGerman: 'Do',
                    idx: 3
                  },
                {
                    name: 'Friday',
                    abbr: 'Fr',
                    abbrGerman: 'Fr',
                    idx: 4
                  },
                {
                    name: 'Saturday',
                    abbr: 'Sa',
                    abbrGerman: 'Sa',
                    idx: 5
                  },
                {
                    name: 'Sunday',
                    abbr: 'Su',
                    abbrGerman: 'So',
                    idx: 6
                  }
              ], function (d) {
                return d.abbrGerman;
            });
        }

        return {
            getDestinationData: getDestinationData,
            getCurrentDestination: getCurrentDestination,
            setCurrentDestination: setCurrentDestination,
            setCurrentDestinationByCountry: setCurrentDestinationByCountry,
            getDays: getDays
        }
}]);