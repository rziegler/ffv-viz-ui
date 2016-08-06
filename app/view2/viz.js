function doViz(destination) {
    // Fix map for IE
    if (!('map' in Array.prototype)) {
        Array.prototype.map = function (mapper, that /*opt*/ ) {
            var other = new Array(this.length);
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    other[i] = mapper.call(that, this[i], i, this);
            return other;
        };
    };

    var browser = BrowserDetect;

    if (isOldBrowser()) {
        console.log("oldie");
        $('#old_browser_msg').show();
        $('#wtf').hide();
        $('fieldset#carrier').addClass('ff3');
        $('#ie8_percents').addClass('ff3');
        $('#share2').addClass('ff3');
        $('#poweredby.old_browsers').show();
    }

    var buckets = 7; // was 11
    var colorScheme = 'orrd'; // 'grn' 'ylrd'

    var destinations = d3.map([
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

    var days = d3.map([
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

    var allData;
    var ffvData;

    var deltaTimes;
    //var departureDates;
    var departureDatesWithMaxDepartureTimes; // departure dates with max number of times per carrier
    var carriers;

    var dateParser = d3.time.format("%Y-%m-%d");
    var timeParser = d3.time.format("%H:%M:%S");
    var dateTimeParser = d3.time.format("%Y-%m-%d %H:%M:%S");

    var descendingIntStrings = function (a, b) {
        a = parseInt(a);
        b = parseInt(b);
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    };

    var ascendingDateStrings = function (a, b) {
        a = dateParser.parse(a);
        b = dateParser.parse(b);
        return d3.ascending(a, b);
    };

    var ascendingDateTimeStrings = function (a, b) {
        a = dateTimeParser.parse(a);
        b = dateTimeParser.parse(b);
        return d3.ascending(a, b);
    };

    var ascendingDateTimeStringsFromObj = function (a, b) {
        aDateTimeStr = a.departureDate + " " + a.departureTime;
        bDateTimeStr = b.departureDate + " " + b.departureTime;
        a = dateTimeParser.parse(aDateTimeStr);
        b = dateTimeParser.parse(bDateTimeStr);
        return d3.ascending(a, b);
    };

    var ascendingTimeStrings = function (a, b) {
        a = timeParser.parse(a);
        b = timeParser.parse(b);
        return d3.ascending(a, b);
    };


    addDestinationButtons();

    d3.select('#vis').classed(colorScheme, true);
    d3.csv("data/data-dest-" + destination + ".csv".toLowerCase(), function (d) {
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

        /* ************************** */
        allData = data;
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

        ffvData = new Object();
        nestedData.forEach(function (v) {
            ffvData[v.key] = v.values;
        });
        console.log(ffvData);

        /* ************************** */

        // carriers
        carriers = d3.map(data,
            function (d) {
                return d.carrier;
            }).keys();

        /* ************************** */

        // x-axis data -> delta times
        deltaTimes = d3.map(data,
            function (d) {
                return d.deltaTime;
            }).keys();
        // map into array with ints instead of Strings (keys() of map returns Strings)
        deltaTimes = $.map(deltaTimes, function (value, index) {
            return [parseInt(value)];
        });
        deltaTimes.sort(d3.descending);
        console.log(deltaTimes);

        /* ************************** */

        // y-axis data -> departure dates
        //    departureDates = d3.map(data,
        //        function (d) {
        //            return d.departureDate;
        //        }).keys();
        //
        //    // map into array with ints instead of Strings (keys() of map returns Strings)
        //    departureDates = $.map(departureDates, function (value, index) {
        //        return [{
        //            date: dateParser.parse(value),
        //            name: value,
        //            abbr: value.split("-")[2] + "." + value.split("-")[1]
        //        }];
        //    });
        //    departureDates.sort(function (a, b) {
        //        return d3.ascending(a.date, b.date);
        //    });
        //    console.log(departureDates);

        /*---*/
        departureDatesWithMaxDepartureTimes = d3.nest()
            .key(function (d) {
                return d.departureDate;
            }).sortKeys(ascendingDateStrings)
            .rollup(function (leaves) {

                // calc number of flights on departure date per carrier
                var perCarrier = d3.nest()
                    .key(function (d) {
                        return d.carrier;
                    }).rollup(function (l) {
                        return l.length / deltaTimes.length;
                    }).map(leaves, d3.map);

                var value = leaves[0].departureDate;
                var wday = leaves[0].departureWeekday
                return {
                    date: dateParser.parse(value),
                    name: value,
                    abbr: value.split("-")[2] + "." + value.split("-")[1],
                    wday: wday,
                    maxFlightsOnDate: d3.max(perCarrier.values()) // keep the maximum number of flighs on date
                };
            })
            .map(data, d3.map);
        console.log(departureDatesWithMaxDepartureTimes);

        /* ************************** */

        addCarrierButtons();

        // start the action
        //        createTiles();
        //        reColorTiles(carriers[0], 'AB');
        createTilesSvg(carriers[0], 'all');

        /* ************************** */

        // carrier list event listener
        $('input[name="carrier"]').change(function () {
            var carrier = $(this).val();

            d3.selectAll('fieldset#carrier label').classed('sel', false);
            d3.select('label[for="carrier_' + carrier + '"]').classed('sel', true);

            //            reColorTiles(carrier);
            createTilesSvg(carrier, 'all');
            //        updateIE8percents(state);
        });

        /* ************************** */

        // weekdays event listener
        $('input[name="weekday"]').change(function () {
            var weekday = $(this).val();
            createTilesSvg(carriers[0], weekday);

            //            d3.selectAll('fieldset#weekday label').classed('sel', false);
            //            d3.select('label[for="wday_' + weekday + '"]').classed('sel', true);
            //
            //            //        console.log(weekday);
            //            d3.selectAll('tr.wd-hidden').classed('wd-hidden', false);
            //            if (weekday !== 'all') {
            //                d3.selectAll('tr.wd-hidden').classed('wd-hidden', false);
            //                var element = d3.select("tbody").selectAll('tr:not(.' + weekday + ')');
            //                console.log(element);
            //                element.each(function (d, i) {
            //                    var element = d3.select(this);
            //                    var cls = element.attr('class');
            //
            //                    if (cls != null) {
            //                        element.classed('wd-hidden', true);
            //                    }
            //                });
            //            }
        });

        /* ************************** */

        // destination list event listener
        $('input[name="destination"]').change(function () {
            var destination = $(this).val();

            d3.selectAll('fieldset#destination label').classed('sel', false);
            d3.select('label[for="destination_' + destination + '"]').classed('sel', true);

            console.log(destination);
        });

        /* ************************** */

        // tiles mouseover events
        $('#tiles td').hover(function () {
                $(this).addClass('sel');

                var tmp = $(this).attr('id').split(/[d,t,h ]/);
                var departureDateIndex = tmp[1];
                var departureTimeIndex = tmp[2];
                var deltaTimeIndex = tmp[3];
                var departureDate = parseInt(departureDateIndex);
                var departureTime = parseInt(departureTimeIndex);
                var deltaTime = parseInt(deltaTimeIndex);

                var tmp = $(this).attr('class').split(' ')[2].split('data-idx');
                var dataIdxIndex = tmp[1];
                var dataIdx = parseInt(dataIdxIndex);

                var $sel = d3.select('#carrier label.sel span');
                if ($sel.empty()) {
                    var carrier = carriers[0];
                } else {
                    var carrier = $sel.attr('class');
                }

                if (isOldBrowser() === false) {
                    drawHourlyChart(carrier, dataIdx);
                    selectHourlyChartBar(deltaTime);
                    drawMinMaxPriceChart(carrier, dataIdx, deltaTime);
                    //                    drawBucketChart(carrier, dataIdx);
                }

                var selFlight = ffvData[carrier][dataIdx];
                var selFlightNumber = selFlight.values[deltaTimeIndex].values[0].flightNumber;
                var selDepartureDate = selFlight.values[deltaTimeIndex].values[0].departureDate;
                var selDepartureTime = selFlight.values[deltaTimeIndex].values[0].departureTime;

                d3.select('#wtf .subtitle').html('Price development for ' + selFlightNumber + ' on ' + selDepartureDate + ' at ' + selDepartureTime);

                var selPrice = selFlight.values[deltaTimeIndex].values[0].price;
                d3.select('#wtf .price').html('CHF ' + selPrice);
            },
            function () {
                $(this).removeClass('sel');

                var $sel = d3.select('#carrier label.sel span');

                if ($sel.empty()) {
                    var carrier = carriers[0];
                } else {
                    var carrier = $sel.attr('class');
                }
                if (isOldBrowser() === false) {
                    drawHourlyChart(carrier, 0);
                    drawMinMaxPriceChart(carrier, 0, 0);
                    //                    drawBucketChart(carrier, 0);
                }
                d3.select('#wtf .subtitle').html('Daily price development');
                d3.select('#wtf .price').html('&nbsp;');
            });
    });


    /* ************************** */

    function isOldBrowser() {
        var result = false;
        if (browser.browser === 'Explorer' && browser.version < 9) {
            result = true;
        } else if (browser.browser === 'Firefox' && browser.version < 4) {
            result = true;
        }
        return result;
    }

    /* ************************** */

    function addCarrierButtons() {
        for (var i = 0; i < carriers.length; i++) {
            var abbr = carriers[i];
            var html = '<input type="radio" id="carrier_' + abbr + '" name="carrier" value="' + abbr + '"/><label for="carrier_' + abbr + '"><span class="' + abbr + '">' + abbr + '</span></label>';

            $('fieldset#carrier').append(html);

            if (i == 0) {
                // make the first button selected
                d3.select('fieldset#carrier label').classed("sel", true);
            }
        }
    }

    /* ************************** */

    function addDestinationButtons() {
        var destKeys = destinations.keys().sort(d3.ascending);
        for (var i = 0; i < destKeys.length; i++) {
            var dest = destinations.get(destKeys[i]);
            var abbr = dest.abbr;
            var name = dest.name
            var html = '<input type="radio" id="dest_' + abbr + '" name="destination" value="' + abbr + '"/><label for="dest_' + abbr + '"><span class="' + abbr + '">' + name + '</span></label>';

            $('fieldset#destination').append(html);

            if (i == 0) {
                // make the first button selected
                d3.select('fieldset#destination label').classed("sel", true);
            }
        }
    }

    /* ************************** */

    function reColorTiles(carrier) {
        var side = d3.select('#tiles').attr('class');

        if (side === 'front') {
            side = 'back';
        } else {
            side = 'front';
        }

        var departureDates = departureDatesWithMaxDepartureTimes.keys().sort(ascendingDateStrings);
        var departureDateCounter = 0;
        var flightCounter = 0;

        // loop over all departure dates
        for (d in departureDates) {
            var departureDate = departureDates[d];
            var obj = departureDatesWithMaxDepartureTimes.get(departureDate);

            // loop over all possible flights on a departure date
            for (var t = 0; t < obj.maxFlightsOnDate; t++) {
                // check if row is correct (same departure date/time) 
                var next = ffvData[carrier][flightCounter];
                var selRow = ".d" + d + ".t" + t;

                // remove current data index classes (dataIdx) from all cells
                var selRowCells = d3.select(selRow).selectAll("td");
                removeCurrentDataIndexClasses(selRowCells);

                if (undefined != next && next.key.split(" ")[0] === obj.name) {
                    //                console.log(next.key + ' <> ' + obj.name + '-> true');

                    if (d3.select(selRow).classed("hidden")) {
                        d3.select(selRow).classed("hidden", false);
                    }

                    // add the data index class to the cells
                    var clsDataIndex = 'data-idx' + flightCounter;
                    selRowCells.classed(clsDataIndex, true);

                    // color all the tiles of the row
                    for (var h = 0; h < next.values.length; h++) { // delta time
                        var sel = '#d' + departureDateCounter + 't' + t + 'h' + h + ' .tile .' + side;
                        var val = next.values[h].values[0].price;
                        var bucket = next.values[h].values[0].bin;

                        // erase all previous bucket designations on this cell
                        for (var i = 1; i <= buckets; i++) {
                            var cls = 'q' + i + '-' + buckets;
                            d3.select(sel).classed(cls, false);
                        }

                        // set new bucket designation for this cell
                        var cls = 'q' + (val > 0 ? bucket : 0) + '-' + buckets;
                        d3.select(sel).classed(cls, true);
                    }

                    flightCounter++;
                } else {
                    //                if (undefined != next) {
                    //                    console.log(next.key + ' <> ' + obj.name + '-> false');
                    //                } else {
                    //                    console.log(departureDateCounter);
                    //                }
                    // hide the row
                    var selRow = ".d" + d + ".t" + t;
                    if (!d3.select(selRow).classed("hidden")) {
                        d3.select(selRow).classed("hidden", true);
                    }
                }

            }
            departureDateCounter++;
        }

        flipTiles();
        if (isOldBrowser() === false) {
            drawHourlyChart(carrier, 0);
            drawMinMaxPriceChart(carrier, 0, 0);
            //            drawBucketChart(carrier, 0);
        }
    }

    function removeCurrentDataIndexClasses(element) {
        var searchPattern = new RegExp('^data-idx');

        element.each(function (d, i) {
            var element = d3.select(this);
            var cls = element.attr('class');
            cls.split(" ").forEach(function (s) {
                // remove all classes starting with 'data-idx'
                if (searchPattern.test(s)) {
                    //                console.log("remove class " + s);
                    element.classed(s, false);
                }
            });
        });
    }

    /* ************************** */

    function flipTiles() {

        var oldSide = d3.select('#tiles').attr('class'),
            newSide = '';

        if (oldSide == 'front') {
            newSide = 'back';
        } else {
            newSide = 'front';
        }

        var flipper = function (h, t, d, side) {
            return function () {
                var sel = '#d' + d + 't' + t + 'h' + h + ' .tile',
                    rotateY = 'rotateY(180deg)';

                if (side === 'back') {
                    rotateY = 'rotateY(0deg)';
                }
                if (browser.browser === 'Safari' || browser.browser === 'Chrome') {
                    d3.select(sel).style('-webkit-transform', rotateY);
                } else {
                    d3.select(sel).select('.' + oldSide).classed('hidden', true);
                    d3.select(sel).select('.' + newSide).classed('hidden', false);
                }

            };
        };

        var departureDates = departureDatesWithMaxDepartureTimes.keys().sort(ascendingDateStrings);

        for (var h = 0; h < deltaTimes.length; h++) {

            for (d in departureDates) {
                var departureDate = departureDates[d];
                var obj = departureDatesWithMaxDepartureTimes.get(departureDate);

                for (var t = 0; t < obj.maxFlightsOnDate; t++) {
                    var side = d3.select('#tiles').attr('class');
                    setTimeout(flipper(h, t, d, side), (h * 20) + (d * 20) + (Math.random() * 100));
                }
            }
        }
        d3.select('#tiles').attr('class', newSide);
    }

    /* ************************** */

    function drawHourlyChart(carrier, row) {

        d3.selectAll('#hourly_values svg').remove();

        var w = 750,
            h = 150;

        var rowData = ffvData[carrier][row];

        var y = d3.scale.linear()
            .domain([0, d3.max(rowData.values, function (d) {
                return d.values[0].price;
            })])
            .range([0, h]);

        var chart = d3.select('#hourly_values .svg')
            .append('svg:svg')
            .attr('class', 'chart')
            .attr('width', 300)
            .attr('height', h + 20); // + 20 for the scale below the chart

        var rect = chart.selectAll('rect'),
            text = chart.selectAll('text');

        //    console.log(rowData);
        rect.data(rowData.values)
            .enter()
            .append('svg:rect')
            .attr('x', function (d, i) {
                return i * 12;
            })
            .attr('y', function (d, i) {
                return h - y(d.values[0].price);
            })
            .attr('height', function (d) {
                return y(d.values[0].price);
            })
            .attr('width', 10)
            .attr('class', function (d, i) {
                return 'hr' + i;
            });

        text.data(rowData.values)
            .enter()
            .append('svg:text')
            .attr('class', function (d, i) {
                return (i % 7) ? 'hidden hr' + i : 'visible hr' + i
            })
            .attr("x", function (d, i) {
                return i * 12
            })
            .attr("y", 166)
            .attr("text-anchor", 'left')
            .text(function (d, i) {
                return d.values[0].deltaTime;
            });
    }

    /* ************************** */

    function drawHourlyText(carrier, row, deltaTime) {
        var selFlight = ffvData[carrier][row];
        var selFlightNumber = selFlight.values[deltaTime].values[0].flightNumber;
        var selDepartureDate = selFlight.values[deltaTime].values[0].departureDate;
        var selDepartureTime = selFlight.values[deltaTime].values[0].departureTime;

        d3.select('#wtf .subtitle').html('Price development for ' + selFlightNumber + ' on ' + selDepartureDate + ' at ' + selDepartureTime);

        var selPrice = selFlight.values[deltaTime].values[0].price;
        d3.select('#wtf .price').html('CHF ' + selPrice);
    }

    /* ************************** */

    function clearHourlyText() {
        d3.select('#wtf .subtitle').html('Daily price development');
        d3.select('#wtf .price').html('&nbsp;');
    }

    /* ************************** */

    function drawMinMaxPriceChart(carrier, row, deltaTime) {

        drawMinMaxPriceChartById(carrier, row, deltaTime, 'minmax', 'viz1');
        //    drawMinMaxPriceChartById(carrier, row, 'minmax', 'viz2');
    }

    function drawMinMaxPriceChartById(carrier, row, deltaTime, divId, vizId) {
        var chart = d3.select("#" + vizId);
        d3.selectAll('#' + vizId + ' div').remove();

        var w = 200,
            h = 200;

        var rowData = ffvData[carrier][row];
        var minPrice = d3.min(rowData.values, function (d) {
            return d.values[0].price;
        });
        var currentPrice = rowData.values[deltaTime].values[0].price;
        var maxPrice = d3.max(rowData.values, function (d) {
            return d.values[0].price;
        });

        var savedPricePercent = (1 - currentPrice / maxPrice) * 100;


        var chartVizComp = vizuly.component.radial_progress(document.getElementById(vizId));

        if (savedPricePercent === 0) {
            // use theme with track_fill WHITE
            var chartTheme = vizuly.theme.ffv(chartVizComp).skin(vizuly.skin.FFV_ALERT_ZERO);
        } else {
            var chartTheme = vizuly.theme.ffv(chartVizComp).skin(vizuly.skin.FFV_ALERT);
        }

        chartVizComp.data(maxPrice + currentPrice) // Current value
            .width(w)
            .height(h)
            .radius(w / 2.2)
            .min(0)
            .max(maxPrice)
            .capRadius(0)
            .startAngle(250) // Angle where progress bar starts
            .endAngle(110) // Angle where the progress bar stops
            .arcThickness(.16) // The thickness of the arc (ratio of radius)
            .duration(0)
            .label(function (d, i) {
                return d3.format(".2f")(savedPricePercent) + '%';
            })
            .update();

        d3.select('#' + divId + ' .min').html('Minimum price CHF ' + minPrice);
        d3.select('#' + divId + ' .max').html('Maximum price CHF ' + maxPrice);
        d3.select('#' + divId + ' .cur').html('Current price CHF ' + currentPrice);
    }

    /* ************************** */

    function drawBucketChart(carrier, row) {
        d3.selectAll('#buckets svg').remove();
        var rowData = ffvData[carrier][row];

        var unnested = function (data, children) {
            var out = [];
            data.values.forEach(function (d, i) {
                //            console.log(i, d);
                d_keys = Object.keys(d);
                //            console.log(i, d_keys)
                values = d[children];

                values.forEach(function (v) {
                    d_keys.forEach(function (k) {
                        if (k != children) {
                            v[k] = d[k]
                        }
                    })
                    out.push(v);
                })
            })
            return out;
        }

        var flattenedRowData = unnested(rowData, "values");
        var binCounted = d3.nest()
            .key(function (d) {
                return d.bin;
            })
            .key(function (d) {
                return d.price;
            })
            .rollup(function (leaves) {
                return {
                    key: leaves[0].price.toString(),
                    bin: leaves[0].bin.toString(),
                    //                key: leaves.length,
                    size: leaves.length
                };
            })
            .entries(flattenedRowData);

        var binCountedWrapped = {
            "key": "bins",
            "values": binCounted
        };
        console.log(binCountedWrapped);

        var data = {
            "name": "flare",
            "children": [
                {
                    "id": "analytics",
                    "children": [
                        {
                            "id": "cluster",
                            "children": [
                                {
                                    "id": "AgglomerativeCluster",
                                    "size": 3938
                        },
                                {
                                    "id": "CommunityStructure",
                                    "size": 3812
                        }
                        ]
                            },

                        {
                            "id": "optimization",
                            "children": [
                                {
                                    "id": "AspectRatioBanker",
                                    "size": 7074
                        }
     ]
    }
   ]
  }
 ]
        };
        //    console.log(data);

        var width = 550,
            height = 250;
        var color = d3.scale.category20c();
        var bucketColor = d3.scale.ordinal()
            .domain(["-1", "0", "1", "2", "3", "4", "5", "6", "7"]) // two dummy-elements -1 and 0 so that the 9-color scale is only using the topmost 7 colors
            .range(colorbrewer.OrRd[9]);

        var treemap = d3.layout.treemap()
            //        .mode('slice-dice')
            .mode('squarify')
            .padding(10)
            .size([width, height])
            .value(function (d) {
                return d.values.size;
            })
            .children(function (d) {
                return d.values;
            });

        var svg = d3.select("#buckets").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(-.5,-.5)");


        var cell = svg.data([binCountedWrapped]).selectAll("g")
            .data(treemap.nodes)
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        cell.append("rect")
            .attr("width", function (d) {
                return d.dx;
            })
            .attr("height", function (d) {
                return d.dy;
            })
            .style("fill", function (d) {
                console.log(d.values);
                if (d.values.constructor === Array) {
                    if (d.key === 'bins') {
                        return '#FFF';
                    } else {
                        return bucketColor(d.key);
                    }
                } else {
                    //                return null;
                    return '#FFF';
                }
            })
            .style("fill-opacity", function (d) {
                if (d.values.constructor === Array) {
                    return "1.0";
                } else {
                    return "0.8";
                }

            });

        cell.append("text")
            .attr("x", function (d) {
                return d.dx / 2;
            })
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .attr("dy", ".25em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                if (d.values.constructor === Array) {
                    return null; // no text for intermediate nodes
                } else {
                    return d.key; // leave nodes present text
                }
            });
    }

    /* ************************** */

    //function drawMobilePie(state) {
    //
    //    var w = 150,
    //        h = 150,
    //        r = Math.min(w, h) / 2,
    //        pieData = [1, data[state].pc2mob],
    //        pie = d3.layout.pie(),
    //        arc = d3.svg.arc().innerRadius(0).outerRadius(r),
    //
    //        d3.select('#pc2mob').attr('class', type);
    //    d3.selectAll('#pc2mob svg').remove();
    //
    //    var chart = d3.select("#pc2mob .svg").append('svg:svg')
    //        .data([pieData])
    //        .attr("width", w)
    //        .attr("height", h);
    //
    //    var arcs = chart.selectAll('g')
    //        .data(pie)
    //        .enter().append('svg:g')
    //        .attr("transform", "translate(" + r + "," + r + ")");
    //
    //    arcs.append('svg:path')
    //        .attr('d', arc)
    //        .attr('class', function (d, i) {
    //            return i === 0 ? 'mob' : 'pc'
    //        });
    //
    //    var rawMobPercent = 100 / (data[state].pc2mob + 1);
    //
    //    if (rawMobPercent < 1) {
    //        var mobPercent = '< 1',
    //            pcPercent = '> 99';
    //    } else {
    //        var mobPercent = Math.round(rawMobPercent),
    //            pcPercent = 100 - mobPercent;
    //    }
    //
    //    d3.select('#pc2mob .pc span').html(pcPercent + '%');
    //    d3.select('#pc2mob .mob span').html(mobPercent + '%');
    //
    //    var html = d3.select('#pc2mob ul').html();
    //    d3.select('#ie8_percents').html(html);
    //}

    /* ************************** */

    function updateIE8percents(state) {

        var rawMobPercent = 100 / (data[state].pc2mob + 1);

        if (rawMobPercent < 1) {
            var mobPercent = '< 1',
                pcPercent = '> 99';
        } else {
            var mobPercent = Math.round(rawMobPercent),
                pcPercent = 100 - mobPercent;
        }

        d3.select('#pc2mob .pc span').html(pcPercent + '%');
        d3.select('#pc2mob .mob span').html(mobPercent + '%');

        var html = d3.select('#pc2mob ul').html();
        d3.select('#ie8_percents').html(html);
    }

    /* ************************** */

    function createTiles() {

        var html = '<table id="tiles" class="front">';

        html += '<tr>';
        html += '<th><div>&nbsp;</div></th>';
        html += '<th><div>&nbsp;</div></th>';

        // header row (with delta times)
        for (var h = 0; h < deltaTimes.length; h++) {
            html += '<th class="h' + h + '">' + deltaTimes[h] + '</th>';
        }
        html += '</tr>';

        var departureDates = departureDatesWithMaxDepartureTimes.keys().sort(ascendingDateStrings);

        // loop over all departure dates
        for (d in departureDates) {
            var departureDate = departureDates[d];
            var obj = departureDatesWithMaxDepartureTimes.get(departureDate);

            // create a row for each possible flight on a departure date
            for (var t = 0; t < obj.maxFlightsOnDate; t++) {
                html += '<tr class="d' + d + ' t' + t + ' wd' + days.get(obj.wday).idx + '">';
                html += '<th>' + days.get(obj.wday).abbr + '</th>';
                html += '<th>' + obj.abbr + '</th>';

                // create a tile for each delta day
                for (var h = 0; h < deltaTimes.length; h++) {
                    html += '<td id="d' + d + 't' + t + 'h' + h + '" class="d' + d + ' h' + h + '"><div class="tile"><div class="face front"></div><div class="face back"></div></div></td>';
                }
                html += '</tr>';
            }
        }

        html += '</table>';
        d3.select('#vis').html(html);
    }

    function createTilesSvg(carrier, weekday) {

        // prepare data for chart
        //        console.log(allData);
        if (weekday === "all") {
            // filter by carrier only
            var filteredCarrierData = allData.filter(function (d) {
                return d.carrier === carrier;
            });
        } else {
            // additionally filter by weekday
            var filteredCarrierData = allData.filter(function (d) {
                return d.carrier === carrier && d.departureWeekday === weekday;
            });
        }

        var filteredDepartureDateData = d3.map(filteredCarrierData, function (d) {
            return d.departureDate + " " + d.departureTime;
        }).values().sort(ascendingDateTimeStringsFromObj);
        //        console.log(filteredDepartureDateData);

        var filteredTilesData = d3.map(filteredCarrierData, function (d) {
            return d.departureDate + " " + d.departureTime + " " + d.deltaTime;
        }).values().sort(ascendingDateTimeStringsFromObj);
        //        console.log(filteredTilesData);

        var margin = {
            top: 50,
            right: 0,
            bottom: 100,
            left: 60
        };
        //        var width = 960 - margin.left - margin.right;
        //        var height = 960 - margin.top - margin.bottom;

        var width = 960 + margin.left + margin.right;
        var gridSize = Math.floor(width / deltaTimes.length);
        // dynamically calc height based on number of flights
        var height = filteredDepartureDateData.length * gridSize + margin.top + margin.bottom;
        //        console.log(width + ":" + height);

        var legendElementWidth = gridSize * 2;
        var maxDeltaTime = d3.max(deltaTimes);

        // use 2 buckets more from colorbrewer but then drop the 2 lightest colors) */
        var colorsOffset = 2;
        var colors = colorbrewer.OrRd[buckets + colorsOffset];


        //        var svg = d3.select("#tiles-chart").append("svg")
        //            .attr("width", width + margin.left + margin.right)
        //            .attr("height", height + margin.top + margin.bottom)
        //            .append("g")
        //            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tilesChart = d3.select("#tiles-chart");
        // remove old div with svg in it
        tilesChart.select("div").remove();

        var svg = tilesChart.append("div")
            .classed("svg-container", true) //container class to make it responsive
            .classed("col s12", true)
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // header text row (with delta times) on x-axis
        var deltaTimeLabel = svg.selectAll(".deltaTimeLabel")
            .data(deltaTimes)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function (d, i) {
                return ((i >= 7 && i <= 16) ? "deltaTimeLabel mono axis axis-worktime" : "deltaTimeLabel mono axis");
            });

        // header text column (departure dates) on y-axis
        var departureDayLabel = svg.selectAll(".departureDayLabel")
            .data(filteredDepartureDateData);

        departureDayLabel.enter().append("text")
            .text(function (d) {
                var ddSplitted = d.departureDate.split("-");
                var ddShort = ddSplitted[2] + "." + ddSplitted[1];
                return days.get(d.departureWeekday).abbr + " " + ddShort;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) {
                return "departureDayLabel mono axis";
            });

        // draw the tiles
        var cards = svg.selectAll(".price")
            .data(filteredTilesData, function (d) {
                return d.departureDate + ":" + d.departureTime + ":" + d.deltaTime;
            });

        cards.enter().append("rect")
            .attr("x", function (d) {
                return (maxDeltaTime - d.deltaTime) * gridSize + 0.5;
            })
            .attr("y", function (d, i) {
                return Math.floor((i) / maxDeltaTime) * gridSize + 0.5;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "price bordered")
            .attr("width", gridSize - 1)
            .attr("height", gridSize - 1)
            .style("fill", "#eee")
            .on("mouseover", function (d) {
                var dataIdx = -1;
                for (var i = 0; i, ffvData[d.carrier].length; i++) {
                    var obj = ffvData[d.carrier][i];
                    if (obj.key === (d.departureDate + " " + d.departureTime)) {
                        dataIdx = i;
                        break;
                    }
                }
                // TODO: refactor drawHourlyChart so that the 2nd param is the object or the key (date + time) of the object...
                var dtInverted = (maxDeltaTime - d.deltaTime);
                drawHourlyChart(d.carrier, dataIdx);
                drawHourlyText(carrier, dataIdx, dtInverted);
                selectHourlyChartBar(dtInverted);
                drawMinMaxPriceChart(d.carrier, dataIdx, dtInverted);
            })
            .on("mouseout", function (d) {
                drawHourlyChart(d.carrier, 0);
                clearHourlyText();
                drawMinMaxPriceChart(d.carrier, 0, 0);
            });

        cards.transition().duration(1000)
            .style("fill", function (d) {
                return colors[colorsOffset + d.bin - 1];
            });

        cards.append("title");
        cards.select("title").text(function (d) {
            return d.departureDate + " " + d.departureTime + " " + d.price;
            //            return d.price;
        });

        cards.exit().remove();

        //        var legend = svg.selectAll(".legend")
        //            .data([0].concat(colorScale.quantiles()), function (d) {
        //                return d;
        //            });
        //
        //        legend.enter().append("g")
        //            .attr("class", "legend");
        //
        //        legend.append("rect")
        //            .attr("x", function (d, i) {
        //                return legendElementWidth * i;
        //            })
        //            .attr("y", height)
        //            .attr("width", legendElementWidth)
        //            .attr("height", gridSize / 2)
        //            .style("fill", function (d, i) {
        //                return colors[i];
        //            });
        //
        //        legend.append("text")
        //            .attr("class", "mono")
        //            .text(function (d) {
        //                return "≥ " + Math.round(d);
        //            })
        //            .attr("x", function (d, i) {
        //                return legendElementWidth * i;
        //            })
        //            .attr("y", height + gridSize);
        //
        //        legend.exit().remove();

        // initially draw charts
        if (isOldBrowser() === false) {
            drawHourlyChart(carrier, 0);
            drawMinMaxPriceChart(carrier, 0, 0);
            //            drawBucketChart(carrier, 0);
        }
    }

    /* ************************** */

    function selectHourlyChartBar(hour) {
        d3.selectAll('#hourly_values .chart rect').classed('sel', false);
        d3.selectAll('#hourly_values .chart rect.hr' + hour).classed('sel', true);

        d3.selectAll('#hourly_values .chart text').classed('hidden', true);
        d3.selectAll('#hourly_values .chart text.hr' + hour).classed('hidden', false);

    }

    /* ************************** */
}