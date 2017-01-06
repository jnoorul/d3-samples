function bubbleChart() {
    var svg = d3.select("svg");
    var margin = {"top": 50, "right": 50, "bottom": 50, "left": 150};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLog().range([0, width]).domain([200, 100000]);
    var y = d3.scaleLinear().range([height, 0]).domain([20, 85]);
    var radius = d3.scaleSqrt().domain([0, 500000000]).range([0, 30]);
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var bisect = d3.bisector(function (d) {
                return d[0]
            });

    function createAxisAndLabel(){
        g.append("g").attr("transform", "translate(-70,0)")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(-70," + height + ")")
            .call(d3.axisBottom(x).ticks(10, ",d"));

        g.append("text")
            .attr("x", width - 55)
            .attr("y", height - 6)
            .attr("text-anchor", "end")
            .text("Income per capita (USD)(Inflation Adjusted)");

        g.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .text("Life expectancy in years");

        g.append("text")
            .attr("class","year")
            .attr("x",width/2)
            .attr("y",height/2)
            .attr("text-anchor","middle")
            .text("")
            .style("fill","rgba(0,0,0,0.2)")
            .text(1800);
    }

    function getInterpolatedData(year,countryInfo) {
                return countryInfo.map(function (data) {
                    var country = {};
                    country.name = data.name;
                    country.region = data.region;
                    country.income = getInterpolatedValues(data.income, year);
                    country.lifeExpectancy = getInterpolatedValues(data.lifeExpectancy, year);
                    country.population = getInterpolatedValues(data.population, year);
                    return country;
                });

    }

    function getInterpolatedValues(values, year) {
                var i = bisect.left(values, year, 0, values.length - 1);
                if (i > 0) {
                    var nextData = values[i];
                    var prevData = values[i - 1];
                    if (nextData[0] === year) {
                        return nextData[1];
                    }
                    var totalDiff = nextData[0] - prevData[0];
                    var prevDiff = year - prevData[0];
                    var nextDiff = nextData[0] - year;
                    return (prevData[1] * (nextDiff / totalDiff)) + (nextData[1] * (prevDiff / totalDiff));
                }

                return values[0][1];
    }


    var output = {};

    output.initialize = function(){
/*
        svg.transition()
            .duration(0);*/

        g.html(null);

        var countryData = d3.json("data.json",function(countryInfo){
            var startYear = 1800;
            createAxisAndLabel();
            var data =  getInterpolatedData(startYear,countryInfo);
            var bubbles = g.selectAll(".bubble")
                .data(data)
                .enter().append("circle")
                .attr("class","bubble")
                .attr("cx",function(d){return x(d.income);})
                .attr("cy",function(d){return y(d.lifeExpectancy);})
                .attr("r",function(d){return radius(d.population);})
                .style("fill",function(d){return color(d.name);})
                .sort(function(a,b){return radius(b.population)-radius(a.population);});

            bubbles.append("title")
                .text(function(d) { return d.name; });

        });
    };

    output.animate = function(){
        var countryData = d3.json("data.json",function(countryInfo){
            svg.transition()
                .duration(30000)
                .ease(d3.easeLinear)
                .tween("year", tweenYear);

            function tweenYear(){
                return function(t){
                    var interpolateYear = d3.interpolateNumber(1800,2009);
                    var year = interpolateYear(t);
                    d3.select(".year").text(Math.round(year));
                    g.selectAll(".bubble").data(getInterpolatedData(year,countryInfo),function(d){return d.name;})
                        .attr("class","bubble")
                        .attr("cx",function(d){return x(d.income);})
                        .attr("cy",function(d){return y(d.lifeExpectancy);})
                        .attr("r",function(d){return radius(d.population);})
                        .sort(function(a,b){return radius(b.population)-radius(a.population);});

                };
            }
        });
    };

    output.reset = function(){
        svg.transition()
            .duration(0);
        setTimeout(function(){ output.initialize();}, 200);
    };

    return output;
}









