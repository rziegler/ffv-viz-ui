/* TIMESERIES - A simple D3.js timeseries.
 *   call timeseries(<classd>, <data>) with the following parameters
 *   classd - the class name of your container div for the timeseries to attach to
 */
(function () {

    var timeseries = function (spaced, data, title, width, $scope, tooltipFn) {
        classd = spaced.replace(new RegExp(" "), ".");
        render(classd, spaced, data, title, width, $scope, tooltipFn);
    }

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------- Rendering ---------------------------------------------
    // ---------------------------------------------------------------------------------------------

    function render(classd, spaced, data, title, width, $scope, tooltipFn) {
        var margin = {
            top: 0,
            right: 1,
            bottom: 20,
            left: 0
        }

        var width = width;
        var height = (200 - margin.top - margin.bottom);

        var dataMin = d3.min(data, function (d) {
            return d.value;
        });
        var dataMax = d3.max(data, function (d) {
            return d.value;
        });

        var x = d3.scale.linear().range([width - margin.left, 0 + margin.right]);
        var y = d3.scale.linear().range([margin.top, height - margin.bottom - margin.top]);

        // number of ticks is number of unique values
        var ticks = d3.map(data, function (d) {
            return d.value;
        }).keys().length;

        x.domain(d3.extent([1, dataMax + 1]));
        y.domain(d3.extent([0, 1]));

        var xAxis = d3.svg.axis().scale(x).orient("bottom")
            //            .ticks(dataMax + 1)
            .tickSize(-height, 0);

        var yAxis = d3.svg.axis().scale(y).orient("left")
            .tickValues([]) //http://stackoverflow.com/questions/19787925/create-a-d3-axis-without-tick-labels

        var widthWithMargins = width + margin.left + margin.right;
        var heightWithMargins = height + margin.top + margin.bottom;
        var svg = d3.select("." + classd).append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + widthWithMargins + " " + heightWithMargins)
            //class to make it responsive
            .classed("svg-content-responsive", true);

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + (height - margin.bottom)) + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("dx", function (d) {
                //                return "-3em";
                //                console.log("XXX" + " " + d + " " + Math.floor(x(d) - x(d + 1)));
                // move the text into the middle of two ticks (calculate the number of pixels and use the middle of it)
                var distBetweenTwoTicks = Math.floor(x(d) - x(d + 1));
                return -(distBetweenTwoTicks / 2);
            })
            .attr("class", function (d, i) {
                return "deltaTimeAxis mono";
            });

        context.append("g")
            .append("text")
            .text("Weeks before departure")
            .attr("x", width / 2)
            .attr("y", heightWithMargins - 12)
            .style("text-anchor", "middle")
            //            .attr("transform", "translate("0, -21)")
            //            .attr("transform", "translate(" + width / 2 + ", -21)")
            .attr("class", function (d, i) {
                return "deltaTimeAxis mono";
            });

        context.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis);
        //            .selectAll("text")
        //            .attr("dy", "8em");


        var texts = context.append("g")

        var textEnter = texts.append("text")
            .attr("class", "dimension")
            .attr("transform", "translate(0,25)");
        textEnter.append("tspan")
            .attr("class", "name")
            .text(title);


        var circles = context.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        circles.selectAll(".circ")
            .data(data)
            .enter().append("circle")
            .attr("class", function (d) {
                return "circ " + d.id.toLowerCase();
            })
            .attr("cx", function (d, i) {
                var distBetweenTwoTicks = Math.ceil(x(i) - x(i + 1))
                var distBetweenTwoTicksDomain = Math.ceil(x.invert(distBetweenTwoTicks));

                var offset = distBetweenTwoTicksDomain / 100;
                var randomPart = (Math.random() * (100 - distBetweenTwoTicksDomain * 2) / 100); // * 2 because the offset is on the left and right
                //                var xValue = d.value + 0.07 + (Math.random() * 86 / 100); // 7% + 86% + 7% = 100%
                var xValue = d.value + offset + randomPart; // 7% + 86% + 7% = 100%
                return (x(xValue));
            })
            .attr("cy", function (d, i) {
                var yValue = 0 + 0.27 + (Math.random() * 66 / 100); // 27% + 66% + 7% =100%
                return (y(yValue));
            })
            .attr("r", 9)
            .on("mouseover", function (d) {
                //                console.log(d.id + " " + d.value);
                d3.select(this).classed("active", true);
                var html = tooltipFn.call(this, d);
                showTooltip(html);
                $scope.$emit('hightlightDestinationOnTimeseriesVis', d.id);

            })
            .on("mouseout", function () {
                d3.select(this).classed("active", false);
                $scope.$emit('hightlightDestinationOnTimeseriesVis', '');
                hideTooltip();
            });

        var body = d3.select("body");
        var tooltip = body.append("div")
            .style("display", "none")
            .attr("class", "timeseries parsets-tooltip");


        function showTooltip(html) {
            var m = d3.mouse(body.node());
            tooltip
                .style("display", "inline")
                .style("left", m[0] + 20 + "px")
                .style("top", m[1] - 20 + "px")
                .html(html);
        }

        function hideTooltip() {
            tooltip.style("display", "none");
        }
    }

    if (typeof define === "function" && define.amd) define(timeseries);
    else if (typeof module === "object" && module.exports) module.exports = timeseries;
    this.timeseries = timeseries;

})();