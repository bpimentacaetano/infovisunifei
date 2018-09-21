window.onload = function() {
  //CAPTURA
 // d3.json("https://hp-api.herokuapp.com/api/characters").then(function(data) {//
     d3.json("https://hp-api.herokuapp.com/api/characters", function(data) {
     console.log(data);
    
    //LIMPEZA
    var dataHouse = data.filter(isHouseNotNull);
    var dataHouseAncestry = dataHouse.filter(isAncestryNull);
   // console.log(dataFilter);
    
   //TRANSFORMAÇÂO
    var nestedData = d3.nest()
      .key(function(d){ return d.house;})
      .key(function(d){ return d.ancestry;})
      .entries(dataHouse);
    
    console.log(nestedData);
    
    //MAPEAMENTO VISUAL
//     d3.select(".chart")
//      .selectAll("div")
//      .data(nestedData)
//      .enter()
//      .append("div")
//      .style("width", function(d) { return d.values.length *100 + "px"; })
//      .text(function(d) { return d.key; });
    

    
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();
    

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

var svg = d3.select('body').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var categoriesNames = nestedData.map(function(d) { return d.key; });
    
  var rateNames = nestedData[0].values.map(function(d) { return d.key; });

       
  x0.domain(categoriesNames);
  x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(nestedData, function(categorie) { return d3.max(categorie.values, function(d) { console.log(d.values.length); return d.values.length; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svg.selectAll(".slice")
      .data(nestedData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values.length; })
  .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.key); })
      .style("fill", function(d) { return color(d.key) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.key)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.key));
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value.length); })
      .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend = svg.selectAll(".legend")
      .data(nestedData[0].values.map(function(d) { return d.key; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

    
    
    
});
    
  
  
};


function isHouseNotNull(value) {
  return value.house !== "";
}

function isAncestryNull(value){
  return value.ancestry !== "";
}