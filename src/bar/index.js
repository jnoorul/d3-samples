d3.select("h1").html("D3 Samples");

var svg = d3.select("svg");
var margin = {"top": 50, "right": 50, "bottom": 50, "left": 50};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

d3.tsv("data.tsv", function (d) {
    d.frequency = +d.frequency;
    return d;
}, function (error, data) {
    if (error) {
        throw error;
    }

    x.domain(data.map(function (d) {
        return d.letter;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class","bar")
        .attr("x", function(d){return x(d.letter);})
        .attr("y",function(d){return y(d.frequency);})
        .attr("width",x.bandwidth())
        .attr("height", function(d){return (height - y(d.frequency));})

    g.append("g")
        .attr("class","axis")
        .attr("transform","translate(0,"+height+")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class","axis")
        .call(d3.axisLeft(y).ticks(5,"%"));

});
