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

function doViz(destination, destinations, days, allData, ffvData, deltaTimes, carriers) {

    var buckets = 7; // was 11
    var colorScheme = 'pubu'; // 'grn' 'ylrd'

    var dateParser = d3.time.format("%Y-%m-%d");
    var timeParser = d3.time.format("%H:%M:%S");

    var margin = {
        top: 31,
        right: 0,
        bottom: 0,
        left: 66
    };
    //        var width = 960 - margin.left - margin.right;
    //        var height = 960 - margin.top - margin.bottom;

    var widthNoMargins = 960;
    var width = widthNoMargins + margin.left + margin.right;

    var gridSize = Math.floor(widthNoMargins / deltaTimes.length);
    var gridSizeDivider = 2;
    var gridSizeY = gridSize / gridSizeDivider;

    // use 2 buckets more from colorbrewer but then drop the 2 lightest colors) */
    var colorsOffset = 2;
    var colors = colorbrewer.PuBu[buckets + colorsOffset];

    d3.select('#vis').classed(colorScheme, true);


    var ascendingDateTimeStringsFromObj = function (a, b) {
        return d3.ascending(a.dts, b.dts);
    };

    // start the action
    createTilesSvg(carriers[0], 'all');
    addListeners();

    function addListeners() {

        // carrier list event listener
        $('#carrier').change(function (event) {
            createTilesSvg(event.carrier, 'all');
        });

        // weekdays event listener
        $('#weekday').change(function (event) {
            if (event.day == 'all') {
                createTilesSvg(carriers[0], 'all');
            } else {
                createTilesSvg(carriers[0], event.day.abbrGerman);
            }
        });
    }

    /* ************************** */

    function drawHourlyChart(carrier, row) {
        d3.selectAll('#hourly_values svg').remove();
        //        var w = 750;
        var w = width;
        var h = 150;

        var rowData = ffvData[carrier][row];

        var y = d3.scale.linear()
            .domain([0, d3.max(rowData.values, function (d) {
                return d.values[0].price;
            })])
            .range([0, h]);

        var chart = d3.select('#hourly_values .svg')
            .append('svg:svg')
            .attr('class', 'chart')
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + 200)
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var rect = chart.selectAll('rect'),
            text = chart.selectAll('text');

        //    console.log(rowData);
        rect.data(rowData.values)
            .enter()
            .append('svg:rect')
            .attr('x', function (d, i) {
                return i * gridSize + 0.5;
            })
            .attr('y', function (d, i) {
                return h - y(d.values[0].price);
            })
            .attr("rx", 0)
            .attr("ry", 0)
            .attr('height', function (d) {
                return y(d.values[0].price);
            })
            .attr('width', gridSize - 1)
            .style("fill", function (d) {
                return colors[colorsOffset + d.values[0].bin];
            })
            //            .style("opacity", "0.9")
            .attr('class', function (d, i) {
                return 'hr' + i + ' bordered';
            });

        text.data(rowData.values)
            .enter()
            .append('svg:text')
            .attr('class', function (d, i) {
                return (i % 2) ? 'hidden hr' + i : 'visible hr' + i
            })
            .attr("x", function (d, i) {
                return i * gridSize
            })
            .attr("y", 166)
            .attr("transform", "translate(" + gridSizeY + ", -2)")
            .attr("text-anchor", 'middle')
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
        var selRequestDate = selFlight.values[deltaTime].values[0].requestDate;
        var selDeltaDays = selFlight.values[deltaTime].values[0].deltaTime;
        var selDestination = selFlight.values[deltaTime].values[0].destination;

        console.log(selDestination);

        var parser = d3.time.format("%Y-%m-%d %H:%M:%S");
        var format = d3.time.format("%A %d.%m.%Y %H:%M");
        var formatDate = d3.time.format("%A %d.%m.%Y");


        console.log(selFlight.values[deltaTime].values[0]);
        var departureDateTime = parser.parse(selDepartureDate + " " + selDepartureTime)
        var requestDate = parser.parse(selRequestDate + " 12:00:00");
        d3.select('#hourly .subtitle').html('Flight ' + selFlightNumber + ' from ZHR to ' + selDestination);
        //+ format(departureDateTime));

        var selPrice = selFlight.values[deltaTime].values[0].price;
        //        d3.select('#hourly .price').html('CHF ' + selPrice + '<br> requested on ' + formatDate(requestDate) + ' (' + selDeltaDays + ' days before departure)');
        // &#10230;
        d3.select('#hourly .price').html('<i class="fa fa-shopping-cart" aria-hidden="true"></i> ' + formatDate(requestDate) + ', <i class="fa fa-clock-o" aria-hidden="true"></i> ' + selDeltaDays + ' days</span><br><i class="fa fa-plane" aria-hidden="true"></i> ' + format(departureDateTime));

        //            'CHF ' + selPrice + '<br> requested on ' + formatDate(requestDate) + ' (' + selDeltaDays + ' days before departure)');
    }

    /* ************************** */

    function clearHourlyText() {
        d3.select('#hourly .subtitle').html('Flight price development');
        d3.select('#hourly .price').html('&nbsp;<br>&nbsp;');
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

        var numberFormat = d3.format(".2f");

        if (savedPricePercent === 0) {
            // use theme with track_fill WHITE
            var chartTheme = vizuly.theme.ffv(chartVizComp).skin(vizuly.skin.FFV_ALERT_ZERO);
            //            var skinName = "bin" + rowData.values[deltaTime].values[0].bin + "zero";
            //            vizuly.theme.ffv(chartVizComp).skin(skinName);
        } else {
            var chartTheme = vizuly.theme.ffv(chartVizComp).skin(vizuly.skin.FFV_ALERT);
            //            var skinName = "bin" + rowData.values[deltaTime].values[0].bin;
            //            vizuly.theme.ffv(chartVizComp).skin(skinName);
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
                return d3.format('.2f')(savedPricePercent) + '%';
            })
            .update();

        d3.select('#' + divId + '-text .min').html('Minimum price CHF ' + numberFormat(minPrice));
        d3.select('#' + divId + '-text .max').html('Maximum price CHF ' + numberFormat(maxPrice));
        d3.select('#' + divId + '-text .cur').html('Current price CHF ' + numberFormat(currentPrice));
    }


    /* ************************** */

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

        // dynamically calc height based on number of flights
        var height = filteredDepartureDateData.length * gridSizeY + margin.top + margin.bottom;
        //        console.log(width + ":" + height);

        var legendElementWidth = gridSize * 2;
        var maxDeltaTime = d3.max(deltaTimes);

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
            //            .classed("col s12", true)
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // header text row (with delta times) on x-axis
        var deltaTimeAxis = svg.append("g").append("text")
            .text("Number of days before departure")
            //            .attr("x", widthNoMargins / 2)
            .attr("x", 0)
            .attr("y", 0)
            .style("text-anchor", "middle")
            //            .attr("transform", "translate("0, -21)")
            .attr("transform", "translate(" + (margin.left + 6) + ", -21)")
            .attr("class", function (d, i) {
                return "deltaTimeAxis mono";
            });

        var deltaTimeLabel = svg.selectAll(".deltaTimeLabel")
            .data(deltaTimes)
            .enter().append("text")
            .text(function (d) {
                return d % 2 == 0 ? "" : d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSizeY + ", -6)")
            .attr("class", function (d, i) {
                return "deltaTimeLabel mono axis";
            });

        // header text column (departure dates) on y-axis
        var departureDayAxis = svg.append("g").append("text")
            .text("Departure date")
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + -(margin.left - 10) + "," + (margin.top + 3) + ") rotate(-90)")
            .attr("class", function (d, i) {
                return "departureDateAxis mono";
            });

        var departureDayLabel = svg.selectAll(".departureDayLabel")
            .data(filteredDepartureDateData)
            .enter().append("text")
            .text(function (d, i) {
                if (i == 0 || (i > 0 && d.departureDate != filteredDepartureDateData[i - 1].departureDate)) {
                    var ddSplitted = d.departureDate.split("-");
                    var ddShort = ddSplitted[2] + "." + ddSplitted[1];
                    return days.get(d.departureWeekday).abbr + ", " + ddShort + ".";
                } else {
                    return "";
                }
            })
            .attr("x", -margin.left + 20)
            .attr("y", function (d, i) {
                return i * gridSizeY;
            })
            .style("text-anchor", "start")
            .attr("transform", "translate(0," + gridSizeY / 1.2 + ")")
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
                return Math.floor((i) / maxDeltaTime) * gridSizeY + 0.5;
            })
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("class", "price bordered")
            .attr("width", gridSize - 1)
            .attr("height", gridSizeY - 1)
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
                return colors[colorsOffset + d.bin];
            })
            //            .style("opacity", "0.9");

        cards.append("title");
        cards.select("title").text(function (d) {
            //            return d.departureDate + " " + d.departureTime + " " + d.price;
            return "";
        });

        cards.exit().remove();


        // initially draw charts
        drawHourlyChart(carrier, 0);
        drawMinMaxPriceChart(carrier, 0, 0);

        // trigger event when tiles-chart is created
        var event = jQuery.Event("change");
        $("#tiles-chart").trigger(event);
    }

    /* ************************** */

    function selectHourlyChartBar(hour) {
        d3.selectAll('#hourly_values .chart rect').classed('sel', false);
        d3.selectAll('#hourly_values .chart rect.hr' + hour + ".bordered").classed('sel', true);

        d3.selectAll('#hourly_values .chart text').classed('hidden', true);
        d3.selectAll('#hourly_values .chart text.hr' + hour).classed('hidden', false);

    }

    /* ************************** */
}