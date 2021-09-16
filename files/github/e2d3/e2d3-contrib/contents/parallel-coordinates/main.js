//# require=d3

var margin = { top: 40, right: 40, bottom: 40, left: 210 },
    width = root.clientWidth - margin.left - margin.right,
    height = root.clientHeight - margin.top - margin.bottom;

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
    .orient("left");

var svg = d3.select(root).append("svg")
    .attr("width", root.clientWidth)
    .attr("height", root.clientHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function update(data) {
  svg.selectAll('*').remove();

  var label = data[0],
      data = data.toList(),
      dimensions = [],
      dragging = {};

  for (e in label) {
      if (dimensions.length == 0) {
          dimensions.push(
            {
              name: String(label[e]),
              scale: d3.scale.ordinal().rangePoints([0, height]),
              type: String
            }    
          )
      }else{
          dimensions.push(
              {
                name: label[e],
                scale: d3.scale.linear().range([height, 0]),
                type: Number
              }
          )
      }
  }

  var dimensionss = [
    {
      name: String(label[0]),
      scale: d3.scale.ordinal().rangePoints([0, height]),
      type: String
    },
    {
      name: label[1],
      scale: d3.scale.linear().range([height, 0]),
      type: Number
    },
    {
      name: label[2],
      scale: d3.scale.linear().range([height, 0]),
      type: Number
    },
    {
      name: label[3],
      scale: d3.scale.linear().range([height, 0]),
      type: Number
    },
    {
      name: label[4],
      scale: d3.scale.linear().range([height, 0]),
      type: Number
    }
  ];

  var x = d3.scale.ordinal()
      .domain(dimensions.map(function(d) { return d.name; }))
      .rangePoints([0, width]);

  var dimension = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

  dimensions.forEach(function(dimension) {
    dimension.scale.domain(dimension.type === Number
        ? d3.extent(data, function(d) { return +d[dimension.name]; })
        : data.map(function(d) { return d[dimension.name]; }).sort());
  });

  svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  dimension.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
    .append("text")
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d.name; });

  // Rebind the axis data to simplify mouseover.
  svg.select(".axis").selectAll("text:not(.title)")
      .attr("class", "label")
      .attr("id", function(d) { return d.name || d; } )
      .data(data, function(d) { return d.name || d; });

  var projection = svg.selectAll(".axis text,.background path,.foreground path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  function mouseover(d) {
    svg.classed("active", true);
    projection.classed("inactive", function(p) { 
      return p !== d && p != d[label[0]]; 
    });
    projection.filter(function(p) { return p === d; }).each(moveToFront);
  }

  function mouseout(d) {
    svg.classed("active", false);
    projection.classed("inactive", false);
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }

  function draw(d) {
    return line(dimensions.map(function(dimension) {
      return [x(dimension.name), dimension.scale(d[dimension.name])];
    }));
  }
}
