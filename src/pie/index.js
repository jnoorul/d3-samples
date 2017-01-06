d3.select("h1").html("D3 Samples");

var svg = d3.select("svg");
var margin = {"top": 50, "right": 50, "bottom": 50, "left": 50};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var radius = Math.min(width, height) / 2;

var arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

var pie = d3.pie().sort(null).value(function (d) {
    return d.population;
});

var color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("data.csv", function (d) {
    d.population = +d.population;
    return d;
}, function (error, data) {
    if (error) {
        throw error;
    }

    g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .style("fill", function(d){return color(d.data.age);});

});