function doParSetViz(data, dimensionLabels, dimensionLabelHighlight, $scope, configService) {

    var chart = d3.parsets()
        .dimensions(dimensionLabels)
        .highlightDimension(dimensionLabelHighlight)
        .tooltip(function (d) {
            var percent = d3.format("%");

            while (d.dimension !== "destination") {
                d = d.parent;
            }

            var current = data.filter(function (item) {
                return item.destination === d.name;
            })[0];

            var destData = configService.getDestinationDataForDestination(current.destination);
            return "<p>" + destData.destinationName + " (" + destData.destination +
                ")</p><p>Book on " + current.minWeekdayBookValue + " (" + percent(current.minWeekdayBookProbability) + " probablity)" +
                "</p><p>Fly on " + current.minWeekdayFlightValue + " (" + percent(current.minWeekdayFlightProbability) + " probablity)</p>";
        })
        .tension(0.5)
        .width(960); // 1 = no curves, 0.5 = curves

    var vis = d3.select("#parset-vis").append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + chart.width() + " " + chart.height())
        //class to make it responsive
        .classed("svg-content-responsive", true);

    var partition = d3.layout.partition()
        .sort(null)
        .size([chart.width(), chart.height() * 5 / 4])
        .children(function (d) {
            return d.children ? d3.values(d.children) : null;
        })
        .value(function (d) {
            return d.count;
        });

    var ice = false;

    // listener for the hightlight event
    chart.on("highlight", function (d) {
        if (d === '') {
            var coordinates = [0, 0];
            coordinates = d3.mouse(d3.select("#parset-vis svg").node());
            var mouseX = coordinates[0];
            var mouseY = coordinates[1];

            var svgWidth = d3.select("#parset-vis svg").attr("width");
            var svgHeight = d3.select("#parset-vis svg").attr("height");

            if (mouseX > 0 && mouseX < svgWidth) {
                if (mouseY > 0 && mouseY < svgHeight) {
                    $scope.$emit('hightlightDestinationOnParsetVis', '');
                }
            }
        } else {
            $scope.$emit('hightlightDestinationOnParsetVis', d.name);
        }
    });

    //    d3.csv("data/flights.csv", function (error, csv) {
    vis.datum(data).call(chart);

    window.icicle = function () {
        var newIce = this.checked,
            tension = chart.tension();
        if (newIce === ice) return;
        if (ice = newIce) {
            var dimensions = [];
            vis.selectAll("g.dimension")
                .each(function (d) {
                    dimensions.push(d);
                });
            dimensions.sort(function (a, b) {
                return a.y - b.y;
            });
            var root = d3.parsets.tree({
                    children: {}
                }, csv, dimensions.map(function (d) {
                    return d.name;
                }), function () {
                    return 1;
                }),
                nodes = partition(root),
                nodesByPath = {};
            nodes.forEach(function (d) {
                var path = d.data.name,
                    p = d;
                while ((p = p.parent) && p.data.name) {
                    path = p.data.name + "\0" + path;
                }
                if (path) nodesByPath[path] = d;
            });
            var data = [];
            vis.on("mousedown.icicle", stopClick, true)
                .select(".ribbon").selectAll("path")
                .each(function (d) {
                    var node = nodesByPath[d.path],
                        s = d.source,
                        t = d.target;
                    s.node.x0 = t.node.x0 = 0;
                    s.x0 = t.x0 = node.x;
                    s.dx0 = s.dx;
                    t.dx0 = t.dx;
                    s.dx = t.dx = node.dx;
                    data.push(d);
                });
            iceTransition(vis.selectAll("path"))
                .attr("d", function (d) {
                    var s = d.source,
                        t = d.target;
                    return ribbonPath(s, t, tension);
                })
                .style("stroke-opacity", 1);
            iceTransition(vis.selectAll("text.icicle")
                    .data(data)
                    .enter().append("text")
                    .attr("class", "icicle")
                    .attr("text-anchor", "middle")
                    .attr("dy", ".3em")
                    .attr("transform", function (d) {
                        return "translate(" + [d.source.x0 + d.source.dx / 2, d.source.dimension.y0 + d.target.dimension.y0 >> 1] + ")rotate(90)";
                    })
                    .text(function (d) {
                        return d.source.dx > 15 ? d.node.name : null;
                    })
                    .style("opacity", 1e-6))
                .style("opacity", 1);
            iceTransition(vis.selectAll("g.dimension rect, g.category")
                    .style("opacity", 1))
                .style("opacity", 1e-6)
                .each("end", function () {
                    d3.select(this).attr("visibility", "hidden");
                });
            iceTransition(vis.selectAll("text.dimension"))
                .attr("transform", "translate(0,-5)");
            vis.selectAll("tspan.sort").style("visibility", "hidden");
        } else {
            vis.on("mousedown.icicle", null)
                .select(".ribbon").selectAll("path")
                .each(function (d) {
                    var s = d.source,
                        t = d.target;
                    s.node.x0 = s.node.x;
                    s.x0 = s.x;
                    s.dx = s.dx0;
                    t.node.x0 = t.node.x;
                    t.x0 = t.x;
                    t.dx = t.dx0;
                });
            iceTransition(vis.selectAll("path"))
                .attr("d", function (d) {
                    var s = d.source,
                        t = d.target;
                    return ribbonPath(s, t, tension);
                })
                .style("stroke-opacity", null);
            iceTransition(vis.selectAll("text.icicle"))
                .style("opacity", 1e-6).remove();
            iceTransition(vis.selectAll("g.dimension rect, g.category")
                    .attr("visibility", null)
                    .style("opacity", 1e-6))
                .style("opacity", 1);
            iceTransition(vis.selectAll("text.dimension"))
                .attr("transform", "translate(0,-25)");
            vis.selectAll("tspan.sort").style("visibility", null);
        }
    };
    d3.select("#icicle")
        .on("change", icicle)
        .each(icicle);
    //    });

    function iceTransition(g) {
        return g.transition().duration(1000);
    }

    function ribbonPath(s, t, tension) {
        var sx = s.node.x0 + s.x0,
            tx = t.node.x0 + t.x0,
            sy = s.dimension.y0,
            ty = t.dimension.y0;
        return (tension === 1 ? [
      "M", [sx, sy],
      "L", [tx, ty],
      "h", t.dx,
      "L", [sx + s.dx, sy],
      "Z"] : ["M", [sx, sy],
      "C", [sx, m0 = tension * sy + (1 - tension) * ty], " ",
           [tx, m1 = tension * ty + (1 - tension) * sy], " ", [tx, ty],
      "h", t.dx,
      "C", [tx + t.dx, m1], " ", [sx + s.dx, m0], " ", [sx + s.dx, sy],
      "Z"]).join("");
    }

    function stopClick() {
        d3.event.stopPropagation();
    }

    // Given a text function and width function, truncates the text if necessary to
    // fit within the given width.
    function truncateText(text, width) {
        return function (d, i) {
            var t = this.textContent = text(d, i),
                w = width(d, i);
            if (this.getComputedTextLength() < w) return t;
            this.textContent = "…" + t;
            var lo = 0,
                hi = t.length + 1,
                x;
            while (lo < hi) {
                var mid = lo + hi >> 1;
                if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
                else hi = mid;
            }
            return lo > 1 ? t.substr(0, lo - 2) + "…" : "";
        };
    }

}