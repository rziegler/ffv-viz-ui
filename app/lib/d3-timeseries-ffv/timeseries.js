/* TIMESERIES - A simple D3.js timeseries.
 *   call timeseries(<classd>, <data>) with the following parameters
 *   classd - the class name of your container div for the timeseries to attach to
 */
(function () {

    var timeseries = function (spaced, data, title, width, $scope) {
        classd = spaced.replace(new RegExp(" "), ".");
        render(classd, spaced, data, title, width, $scope);
    }

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------- Rendering ---------------------------------------------
    // ---------------------------------------------------------------------------------------------

    function render(classd, spaced, data, title, width, $scope) {

        var margin = {
            top: 0,
            right: 1,
            bottom: 15,
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

        var svg = d3.select("." + classd).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

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
                console.log(d.id + " " + d.value);
                d3.select(this).classed("active", true);
                $scope.$emit('hightlightDestinationOnTimeseriesVis', d.id);
                //                redraw();
            })
            .on("mouseout", function () {
                d3.select(this).classed("active", false);
                $scope.$emit('hightlightDestinationOnTimeseriesVis', '');
                //                redraw();
            });
        //            .on("click", function (d) {
        //                console.log(d);
        //
        //            })


    }

    /* Use this function, in conjunction to setting a time element to 'selected', to highlight the 
    data point on the timeseries. */
    function redraw() {
        d3.selectAll(".circ")
            .transition(10)
            .attr("r", function (d) {
                return 9;
            });
        d3.selectAll(".circ.active")
            .transition(10)
            .attr("r", function (d) {
                return 15;
            });
    }

    if (typeof define === "function" && define.amd) define(timeseries);
    else if (typeof module === "object" && module.exports) module.exports = timeseries;
    this.timeseries = timeseries;

})();