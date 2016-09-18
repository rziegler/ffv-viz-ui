vizuly.theme.ffv = function (viz) {

    //The first thing we do is define the skins themselves as objects.
    //Each skin shares an **identical set of parameters**.  Unlike CSS, which contains primarily static values,
    //the skin parameters can contain dynamic functions; which we will see applied a little later on.
    //For this theme we will create the following skins:
    //
    //*Note: vizuly themes are optimized for readability customization, NOT performance. For instance, you may want to create a mobile version of a theme that
    //is optimized for performance and doesn't use gradients and filters, which can slow down rendering.*
    // Here are our custom skins
    var skins = {
        bin0: {
            name: "bin0", // Skin Name
            label_color: "#444", // Color of the center label
            track_fill: "#e0874d", // Color of the background 'track' of the progress bar
            progress_colors: ["#023858", "#d0d1e6"], // Colors used for progress bar
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2]; // Dynamic function that returns a fill based on the index value
            },
            arc_fill_opacity: function (d, i) {
                return 1; // Dynamic function that returns opacity
            },
            arc_stroke: function (d, i) {
                return null;
            },
            // Each skin can also have a **CSS class** with styles that don't need to be changed dynamically by the theme directly.
            class: "vz-skin-alert" // CSS Class that it will apply to the viz object output.
        },
        bin0zero: {
            name: "bin0zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#d0d1e6"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin1: {
            name: "bin1",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#a6bddb"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin1zero: {
            name: "bin1zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#a6bddb"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin2: {
            name: "bin2",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#74a9cf"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin2zero: {
            name: "bin2zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#74a9cf"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin3: {
            name: "bin3",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#3690c0"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin3zero: {
            name: "bin3zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#3690c0"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin4: {
            name: "bin4",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#0570b0"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin4zero: {
            name: "bin4zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#0570b0"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin5: {
            name: "bin5",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#045a8d"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin5zero: {
            name: "bin5zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#045a8d"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin6: {
            name: "bin6",
            label_color: "#444",
            track_fill: "#e0874d",
            progress_colors: ["#023858", "#023858"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        },
        bin6zero: {
            name: "bin6zero",
            label_color: "#444",
            track_fill: "#fff",
            progress_colors: ["#023858", "#023858"],
            arc_fill: function (d, i) {
                return this.progress_colors[i % 2];
            },
            arc_fill_opacity: function (d, i) {
                return 1;
            },
            arc_stroke: function (d, i) {
                return null;
            },
            class: "vz-skin-alert"
        }
    }


    // This is the **viz** we will be styling.
    var viz = viz;

    // We put the **callbacks** in an array so we can keep track of them when we need to release the viz.
    var callbacks = [
        {
            on: "update.theme",
            callback: applyTheme
        },
        {
            on: "mouseover.theme",
            callback: onMouseOver
        },
        {
            on: "mouseout.theme",
            callback: onMouseOut
        }
    ];

    // Now we create our function chained **theme** object that will wrap a closure around its functions.
    theme();

    // The only thing we need to do at this point is bind our callbacks to the viz object.
    function theme() {
        applyCallbacks();
    }

    //The <code>applyTheme()</code> function is **the heart** of our theme.  This function is triggered on any
    //<code>viz.update()</code> event and is responsible for making all of the primary visual updates to the viz.
    function applyTheme() {
        // If we don't have a skin, we want to exit - as there is nothing we can do.
        if (!skin) return;

        // Grab the d3 **selection** from the viz so we can operate on it.
        var selection = viz.selection();

        // Set our skin **css** class
        selection.attr("class", skin.class);

        // Style our **progress** arcs
        selection.selectAll(".vz-radial_progress-arc")
            .style("fill", function (d, i) {
                return skin.arc_fill(d, i)
            })
            .style("fill-opacity", function (d, i) {
                return skin.arc_fill_opacity(d, i)
            })
            .style("stroke", function (d, i) {
                return skin.arc_stroke(d, i)
            });

        // Style the **track** arcs
        selection.selectAll(".vz-radial_progress-track")
            .style("fill", skin.track_fill);

        // Style the **label**
        selection.selectAll(".vz-radial_progress-label")
            .style("fill", skin.label_color)
            .style("stroke-opacity", 0)
            .style("font-size", viz.radius() * .25); // Notice we dynamically size the font based on the gauge radius.

    }

    //Now we get to some user triggered display changes.
    //For the gauge we simply change the font-weight of the label when a **mouseover** event occurs.
    function onMouseOver(e, d, i) {
        viz.selection().selectAll(".vz-radial_progress-label")
            .style("font-weight", 700);
    }

    //On **mouseout** we want to undo any changes we made on the mouseover callback.
    function onMouseOut(e, d, i) {
        viz.selection().selectAll(".vz-radial_progress-label")
            .style("font-weight", null);
    }

    // This function **binds** all of our theme **callbacks** to the viz so the theme can respond to events as needed.
    function applyCallbacks() {
        callbacks.forEach(function (d) {
            viz.on(d.on, d.callback);
        });
    }

    // This function **removes** all of our theme **callbacks** from the viz to free up any event listeners.
    function removeCallbacks() {
        callbacks.forEach(function (d) {
            viz.on(d.on, null);
        })
    }

    //-------------------------------------------------------
    //
    // Here are our **public accessors**.  All vizuly classes (function closures) are built the same as the ones in D3.
    // We have public functions that set private variables and pass back a reference a function closure.
    // This allows the programmer to use the declarative function chain syntax when programming.
    //
    //---------------------------------------------------------

    //This function is used to set a **new skin** and immediately apply the changes.  You could define your own custom skins outside of the theme, and as long as they
    //have the same parameters as the skins defined within the theme, they would work just as well.
    theme.apply = function (skin) {
        if (arguments.length > 0)
            theme.skin(skin);
        applyTheme();
        return theme;
    }

    // This **removes**  the viz from skin and any associated event listeners.
    theme.release = function () {
        if (!viz) return;
        viz.selection().attr("class", null);
        removeCallbacks();
        viz = null;
    };

    // Here we can either manually set a new viz object or **grab a reference** to the current one.
    theme.viz = function (_) {
        if (!arguments.length) {
            return viz;
        }
        if (viz) {
            removeCallbacks();
        }
        viz = _;
        applyCallbacks();
    }

    // Sets the **skin** for the theme
    theme.skin = function (_) {
        if (arguments.length == 0) {
            return skin;
        }
        if (skins[_]) {
            skin = skins[_];
        } else {
            throw new Error("theme/linearea.js - skin " + _ + " does not exist.");
        }

        return theme;
    }

    // Returns **all of the skins**
    theme.skins = function () {
        return skins;
    }


    // This is the holder for the active skin
    var skin = skins[vizuly.skin.FFV_WHITE];

    return theme;

}

// We keep our skins declared as **constants** so we can easily reference them in other functions
vizuly.skin.FFV_ALERT = "Alert";
vizuly.skin.FFV_ALERT_ZERO = "AlertZero";

// And that is pretty much it.  This is a pretty simple theme, some of the other vizuly components implement more
// sophisticated themes.

//
//
// <code> @version 1.0.20 </code>

/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 MIT LICENSE:

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 */