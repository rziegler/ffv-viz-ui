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

        var setCurrentDestination = function(destCode){
            destinationData.values().forEach(function(entry){
               if(entry.destination == destCode){
                   currentDestination =  entry;
               }
            });
        }

      function getDestinations() {
          return d3.map([
              {
                  abbr: 'AMS',
                  name: 'Amsterdam'
              },
              {
                  abbr: 'BEG',
                  name: 'Belgrade'
              },
              {
                  abbr: 'BKK',
                  name: 'Bangkok'
              },
              {
                  abbr: 'BOM',
                  name: 'Bombay'
              },
              {
                  abbr: 'DXB',
                  name: 'Dubai'
              },
              {
                  abbr: 'GRU',
                  name: 'Sao Paolo'
              },
              {
                  abbr: 'ICN',
                  name: 'Seoul'
              },
              {
                  abbr: 'IST',
                  name: 'Istanbul'
              },
              {
                  abbr: 'JFK',
                  name: 'New York'
              },
              {
                  abbr: 'KEF',
                  name: 'Reykjavik'
              },
              {
                  abbr: 'LHR',
                  name: 'London'
              },
              {
                  abbr: 'MAD',
                  name: 'Madrid'
              },
              {
                  abbr: 'MLA',
                  name: 'Malta'
              },
              {
                  abbr: 'NRT',
                  name: 'Tokyo'
              },
              {
                  abbr: 'PEK',
                  name: 'Peking'
              },
              {
                  abbr: 'RHO',
                  name: 'Rhode'
              },
              {
                  abbr: 'RIX',
                  name: 'Riga'
              },
              {
                  abbr: 'SIN',
                  name: 'Singapore'
              },
              {
                  abbr: 'SVO',
                  name: 'Moscou'
              },
              {
                  abbr: 'YYZ',
                  name: 'Toronto'
              }

          ], function (d) {
              return d.abbr;
          });
      }

          function getDays() {
              return d3.map([
                  {
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
            getDestinations: getDestinations,
            getDays: getDays
        }
}]);