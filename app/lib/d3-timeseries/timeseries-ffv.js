/* TIMESERIES - A simple D3.js timeseries.
 *   call timeseries(<classd>, <data>) with the following parameters
 *   classd - the class name of your container div for the timeseries to attach to
 */
(function () {

    var timeseriesFfv = function (spaced, data) {
        classd = spaced.replace(new RegExp(" "), ".");
        render(classd, spaced, data);
    }

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- Time Manipulation ----------------------------------------
    // ---------------------------------------------------------------------------------------------

    function lessThanDay(d) {
        return (d === "hours" || d === "minutes" || d === "seconds") ? true : false;
    }

    function getDate(d) {
        var date = moment(d);
        date.hour(1);
        date.minute(0);
        date.second(0);
        return date.valueOf();
    }

    function getTime(d) {
        var date = moment(d);
        date.date(1);
        date.month(0);
        date.year(2012);
        return date.valueOf();
    }

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------- Rendering ---------------------------------------------
    // ---------------------------------------------------------------------------------------------

    function render(classd, spaced, data) {

        //        var padding = timeRangePad(_.pluck(data, 'value'));

        var margin = {
            top: 10,
            right: 25,
            bottom: 15,
            left: 35
        }
        var width = window.innerWidth - 150;
        var height = (200 - margin.top - margin.bottom);

        var dataMin = d3.min(data, function (d) {
            return d.value;
        });
        var dataMax = d3.max(data, function (d) {
            return d.value;
        });

        var x = d3.scale.linear().range([0 + margin.right, width - margin.left]);
        var y = d3.scale.linear().range([margin.top, height - margin.bottom - margin.top]);

        // number of ticks is number of unique values
        var ticks = d3.map(data, function (d) {
            return d.value;
        }).keys().length;

        x.domain(d3.extent([dataMin, dataMax + 1]));


        y.domain(d3.extent([0, 1]));

        var xAxis = d3.svg.axis().scale(x).orient("bottom")
            //            .ticks(ticks * 2 - 1)
            .ticks(ticks)
            .tickSize(-height, 0);

        var yAxis = d3.svg.axis().scale(y).orient("left")
            .ticks(1)
            .tickSize(-width + margin.right, margin.left);
        //            .tickFormat(d3.time.format(yFormat));

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
            .attr("dx", "8em");

        context.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis);
        //            .selectAll("text")
        //            .attr("dy", "8em");

        var circles = context.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        circles.selectAll(".circ")
            .data(data)
            .enter().append("circle")
            .attr("class", "circ-ffv")
            .attr("cx", function (d) {
                var xValue = d.value + 0.07 + (Math.random() * 86 / 100);
                return (x(xValue));
            })
            .attr("cy", function (d, i) {
                var yValue = 0 + 0.07 + (Math.random() * 86 / 100);
                return (y(yValue));
            })
            .attr("r", 9)
            .on("mouseover", function (d) {
                console.log(d.id);
            })
            .on("click", function (d) {
                console.log(d);
            })
    }

    /* Use this function, in conjunction to setting a time element to 'selected', to highlight the 
    data point on the timeseries. */
    function redraw() {
        d3.selectAll(".circ")
            .transition(10)
            .style("opacity", function (d) {
                return d.selected ? 1 : 0.6;
            })
            .attr("r", function (d) {
                return d.selected ? 15 : 7;
            });
    }

    if (typeof define === "function" && define.amd) define(timeseriesFfv);
    else if (typeof module === "object" && module.exports) module.exports = timeseries;
    this.timeseriesFfv = timeseriesFfv;

})();