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
    var colorScheme = 'orrd'; // 'grn' 'ylrd'

    var dateParser = d3.time.format("%Y-%m-%d");
    var timeParser = d3.time.format("%H:%M:%S");

    var margin = {
        top: 16,
        right: 0,
        bottom: 0,
        left: 50
    };
    //        var width = 960 - margin.left - margin.right;
    //        var height = 960 - margin.top - margin.bottom;

    var widthNoMargins = 960;
    var width = widthNoMargins + margin.left + margin.right;

    var gridSize = Math.floor(widthNoMargins / deltaTimes.length);
    var gridSizeDivider = 2;
    var gridSizeY = gridSize / gridSizeDivider;
    console.log(gridSizeY);


    // use 2 buckets more from colorbrewer but then drop the 2 lightest colors) */
    var colorsOffset = 2;
    var colors = colorbrewer.OrRd[buckets + colorsOffset];

    d3.select('#vis').classed(colorScheme, true);


    var ascendingDateTimeStringsFromObj = function (a, b) {
        var dateTimeParser = d3.time.format("%Y-%m-%d %H:%M:%S");
        var aDateTimeStr = a.departureDate + " " + a.departureTime;
        var bDateTimeStr = b.departureDate + " " + b.departureTime;
        a = dateTimeParser.parse(aDateTimeStr);
        b = dateTimeParser.parse(bDateTimeStr);
        return d3.ascending(a, b);
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
            console.log(event.day);
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
            .attr("rx", 2)
            .attr("ry", 2)
            .attr('height', function (d) {
                return y(d.values[0].price);
            })
            .attr('width', gridSize - 1)
            .style("fill", function (d) {
                return colors[colorsOffset + d.values[0].bin - 1];
            })
            .attr('class', function (d, i) {
                return 'hr' + i + ' bordered';
            });

        text.data(rowData.values)
            .enter()
            .append('svg:text')
            .attr('class', function (d, i) {
                return (i % 7) ? 'hidden hr' + i : 'visible hr' + i
            })
            .attr("x", function (d, i) {
                return i * gridSize + 2
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

        var parser = d3.time.format("%Y-%m-%d %H:%M:%S");
        var format = d3.time.format("%d.%m.%Y %H:%M");

        var dateTime = parser.parse(selDepartureDate + " " + selDepartureTime)

        d3.select('#wtf .subtitle').html('Price development for<br>' + selFlightNumber + ' on ' + format(dateTime));

        var selPrice = selFlight.values[deltaTime].values[0].price;
        d3.select('#wtf .price').html('CHF ' + selPrice);
    }

    /* ************************** */

    function clearHourlyText() {
        d3.select('#wtf .subtitle').html('Flight price development');
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
        var departureDayLabel = svg.selectAll(".departureDayLabel")
            .data(filteredDepartureDateData);

        departureDayLabel.enter().append("text")
            .text(function (d, i) {
                if (i == 0 || (i > 0 && d.departureDate != filteredDepartureDateData[i - 1].departureDate)) {
                    var ddSplitted = d.departureDate.split("-");
                    var ddShort = ddSplitted[2] + "." + ddSplitted[1];
                    return days.get(d.departureWeekday).abbr + ", " + ddShort + ".";
                } else {
                    return "";
                }
            })
            .attr("x", -margin.left)
            .attr("y", function (d, i) {
                return i * gridSizeY;
            })
            .style("text-anchor", "start")
            .attr("transform", "translate(0," + gridSizeY / 1.2 + ")")
            .attr("class", function (d, i) {
                return "departureDayLabel mono axis";
            });

        // draw the tiles
        console.log(gridSizeY);
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
            .attr("rx", 2)
            .attr("ry", 2)
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
                return colors[colorsOffset + d.bin - 1];
            });

        cards.append("title");
        cards.select("title").text(function (d) {
            //            return d.departureDate + " " + d.departureTime + " " + d.price;
            return "";
        });

        cards.exit().remove();


        // initially draw charts
        drawHourlyChart(carrier, 0);
        drawMinMaxPriceChart(carrier, 0, 0);

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