function buildMetadata(route) {
  d3.json(`/metadata/+${route}`).then(function(response) {
    console.log("newdata", response);
    
    var tableData = response

    var panel = d3.select(".panel-body")
    panel.select("ul").remove()
    var list = panel.append("ul")
    
    Object.entries(tableData).forEach(([key,value]) => {
        var cell = list.append("p");
        cell.text(`${key}: ${tableData[key]}`)
    });
  });

};

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(route) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${route}`).then(function(response){
    console.log(response)

    var data = [{
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      text: response.otu_labels,
      marker: {
        size: response.sample_values,
        color: response.otu_ids,
        colorscale: "Earth"
      }
    }]

    var pieData = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      text: response.otu_labels,
      type: "pie"
    }]

    var pieLayout = {
      title: "OTU per Sample",
      yaxis: {
          autorange: true}

    };


    Plotly.newPlot("bubble", data);
    Plotly.newPlot("pie",pieData, pieLayout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset")
  var sample = selector.node().value

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildMetadata(firstSample)
    buildCharts(firstSample)

    // d3.json(`/metadata/+${firstSample}`).then(function(first){
    //   buildMetadata(first);
    // });
    // d3.json(`/samples/${firstSample}`).then(function(first){
    //   buildCharts(first);
    // });
  })

};


function optionChanged(route) {
  
  // d3.json(`/metadata/+${route}`).then(function(response) {
  //   console.log("newdata", response);
  // });
  buildMetadata(route);
  buildCharts(route)
};

// Initialize the dashboard
init();
