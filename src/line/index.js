d3.select("h1").html("D3 Samples");

var svg = d3.select("svg");
var margin = {"top":50,"right":50,"bottom":50,"left":50};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

var parseTime = d3.timeParse("%d-%b-%y");

//scaling code here

var x = d3.scaleTime().rangeRound([0,width]);
var y = d3.scaleLinear().rangeRound([height,0]);

var line = d3.line().x(function(d){return x(d.date);}).y(function(d){return y(d.close);});

d3.tsv("data.tsv", function(d){
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
},function(error, data){
    if(error) {throw error;}

    x.domain(d3.extent(data,function(d){return d.date;}));
    y.domain(d3.extent(data,function(d){return d.close}));

    g.append("path")
        .datum(data)
        .attr("class","line")
        .attr("d",line);

    g.append("g")
        .attr("class","axis")
        .attr("transform","translate(0,"+height+")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class","axis")
        .call(d3.axisLeft(y));

});



