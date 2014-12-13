/**
 * Created by stanley on 11/30/14.
 */
var salesData=[
    {label:"BS", color:"#3366CC"},
    {label:"BA", color:"#DC3912"},
    {label:"MS", color:"#FF9900"},
    {label:"MA", color:"#109618"},
    {label:"PhD", color:"#990099"}
];

labels = ["BS", "BA", "MS", "MA", "PhD"];

var svg = d3.select("#chart").append("svg").attr("width", 150).attr("height", 130).attr('class', 'ichart');

svg.append("g").attr("id","quotesDonut");

Donut3D.draw("quotesDonut", randomData(), 75, 60, 64, 56, 8, 0);

function randomData(){
    return salesData.map(function(d){
        return {label:d.label, value:20, color:d.color};});
}

var color = d3.scale.ordinal()
    .range(["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"]);

var legend = d3.select("#degree_guide").append("svg")
    .attr("class", "legend")
    .attr("width", 60)
    .attr("height", 100)
    .selectAll("g")
    .data(labels)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) { return d; });




var margin = {top: 40, right: 20, bottom: 30, left: 25},
    width = 200 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
//        .tickFormat(formatPercent);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Price:</strong> <span style='color:lightblue'> $" + d.frequency + "/hr</span>";
    })

var svg2 = d3.select("#price").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg2.call(tip);

var _data = {};

d3.tsv("statistics", type, function(error, data) {
    x.domain(data.map(function (d) {
        return d.letter;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".61em")
        .style("text-anchor", "end")
        .text("Price");

    svg2.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.letter);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.frequency);
        })
        .attr("height", function (d) {
            return height - y(d.frequency);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});

function type(d) {
    d.frequency = +d.frequency;
    return d;
}