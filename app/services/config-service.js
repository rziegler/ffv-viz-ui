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

        var getDestinationDataForDestination = function (destCode) {
            var result = {};
            destinationData.values().forEach(function (entry) {
                if (entry.destination == destCode) {
                    result = entry;
                }
            });
            return result;
        }

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

        var getFullDayForAbbr = function (abbr) {
            var result = {};
            console.log(abbr);
            var abbrShortened = abbr.substring(0, 1);
            console.log(abbrShortened);
            getDays().values().forEach(function (entry) {
                if (entry.abbr == abbrShortened) {
                    result = entry;
                }
            });
            return result;
        }

        function getSavings() {
            return d3.map([
                {
                    destination: 'KEF',
                    product: 'Entry into Blue Lagoon',
                    category: 'Sight',
                    cost: 50,
                    costCurrency: 'EUR',
                    costCHF: 55
                  }, {
                    destination: 'NRT',
                    product: 'Ramen soup',
                    category: 'Food',
                    cost: 1000,
                    costCurrency: 'YEN',
                    costCHF: 8
                  }, {
                    destination: 'ICN',
                    product: 'Korean Barbecue',
                    category: 'Food',
                    cost: 17000,
                    costCurrency: 'Won',
                    costCHF: 15
                  }, {
                    destination: 'SIN',
                    product: 'Singapore Sling',
                    category: 'Drink',
                    cost: 20,
                    costCurrency: 'SGD',
                    costCHF: 14.5
                  }, {
                    destination: 'IST',
                    product: 'Kebab',
                    category: 'Food',
                    cost: 5,
                    costCurrency: 'TRY',
                    costCHF: 1.7
                  }, {
                    destination: 'MAD',
                    product: 'Racion Tapas',
                    category: 'Food',
                    cost: 6,
                    costCurrency: 'EUR',
                    costCHF: 6.6
                  }, {
                    destination: 'BKK',
                    product: 'Thai massage',
                    category: 'Sight',
                    cost: 500,
                    costCurrency: 'THB',
                    costCHF: 14
                  }, {
                    destination: 'PEK',
                    product: 'Visit of the Forbidden City',
                    category: 'Sight',
                    cost: 60,
                    costCurrency: 'CNY',
                    costCHF: 9
                  }, {
                    destination: 'BOM',
                    product: 'Entry to Taj Mahal', // 'Samosa from street vendor
                    category: 'Sight',
                    cost: 750, // 6
                    costCurrency: 'INR',
                    costCHF: 11.05 // 0.1
                  }, {
                    destination: 'RIX',
                    product: 'Dinner at Rozengrāls',
                    category: 'Food',
                    cost: 50,
                    costCurrency: 'EUR',
                    costCHF: 55
                  }, {
                    destination: 'LHR',
                    product: 'Pint of Beer',
                    category: 'Drink',
                    cost: 3.5,
                    costCurrency: 'GBP',
                    costCHF: 4.5
                  }, {
                    destination: 'DXB',
                    product: 'Drive to Top of Burj Khalifa',
                    category: 'Sight',
                    cost: 300,
                    costCurrency: 'AEB',
                    costCHF: 80
                  }, {
                    destination: 'GRU',
                    product: 'Moqueca',
                    category: 'Food',
                    cost: 45,
                    costCurrency: 'BRL',
                    costCHF: 13.55
                  }, {
                    destination: 'AMS',
                    product: 'Stroopwafel',
                    category: 'Food',
                    cost: 2.25,
                    costCurrency: 'EUR',
                    costCHF: 2.5
                  }, {
                    destination: 'JFK',
                    product: 'Burger with Fries',
                    category: 'Drink',
                    cost: 15,
                    costCurrency: 'USD',
                    costCHF: 14.7
                  }, {
                    destination: 'YYZ',
                    product: 'Day-trip to Niagara Falls',
                    category: 'Sight',
                    cost: 93,
                    costCurrency: 'CAD',
                    costCHF: 70
                  }, {
                    destination: 'SVO',
                    product: 'Bottle (0.5l) of Vodka',
                    category: 'Drink',
                    cost: 450,
                    costCurrency: 'RUB',
                    costCHF: 6.8
                  }, {
                    destination: 'RHO',
                    product: 'Moussaka',
                    category: 'Food',
                    cost: 10,
                    costCurrency: 'EUR',
                    costCHF: 10.9
                  }, {
                    destination: 'MLA',
                    product: 'Kinnie (0.5l)',
                    category: 'Drink',
                    cost: 1.1,
                    costCurrency: 'EUR',
                    costCHF: 1.2
                  }, {
                    destination: 'BEG',
                    product: 'Ćevapčići',
                    category: 'Food',
                    cost: 250,
                    costCurrency: 'RSD',
                    costCHF: 2.2
                  }

                /*
                , {
                    destination: '',
                    product: '',
                    cost: ,
                    costCurrency: '',
                    costCHF:
                  }
                */
              ], function (d) {
                return d.destination;
            });
        }

        var getSavingsForDestination = function (id) {
            return getSavings().get(id);
        }

        return {
            getDestinationData: getDestinationData,
            getDestinationDataForDestination: getDestinationDataForDestination,
            getCurrentDestination: getCurrentDestination,
            setCurrentDestination: setCurrentDestination,
            setCurrentDestinationByCountry: setCurrentDestinationByCountry,
            getDays: getDays,
            getFullDayForAbbr: getFullDayForAbbr,
            getSavings: getSavings,
            getSavingsForDestination: getSavingsForDestination
        }
}]);