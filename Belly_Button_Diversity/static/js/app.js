function buildMetadata(sampleID) {
  url = '/metadata/'+sampleID
  Plotly.d3.json(url, function(data){
    console.log(data);
    var selector = d3.select("#sample-metadata");
    selector.html("");
    var sel = selector.append("ul");
    Object.entries(data).forEach(([key, value]) => {
      var li = sel.append("li").text(`${key}: ${value}`);
    });

    })
  }

  //Below is how to add each key value manually
    //   sel.append("li")
    //     .text("Age: "+data.AGE);
    //   sel.append("li")
    //     .text("BBTYPE: "+data.BBTYPE);
    //   sel.append("li")
    //     .text("ETHNICITY: "+data.ETHNICITY);
    //   sel.append("li")
    //     .text("GENDER: "+data.GENDER);
    //   sel.append("li")
    //     .text("LOCATION: "+data.LOCATION);
    //   sel.append("li")
    //     .text("WFREQ: "+data.WFREQ);
    //   sel.append("li")
    //     .text("sample: "+data.sample);
    

function getPieChartData(data) {
    console.log(data.sample_values);
    console.log(data.otu_ids);
    console.log(data.otu_labels);
     // Slice the first 10 objects for plotting
    top10Samples = data.sample_values.slice(0, 10);
    top10OTUIDs = data.otu_ids.slice(0, 10);
    top10OUTLabels = data.otu_labels.slice(0, 10);
    console.log(top10Samples);
    console.log(top10OTUIDs);
    console.log(top10OUTLabels);
    pieChartData = [{
        "labels": top10OTUIDs,
        "values": top10Samples,
        "type": "pie"}]

    return pieChartData
    
}

function buildPie(sampleID) {
    url='/samples/'+sampleID;
  Plotly.d3.json(url, function(data){

      var layout = {
          title: "Biodiversity Chart",
          height: 600,
          width: 600
        };
      var PIE = document.getElementById('pie');

      var trace=getPieChartData(data);

      Plotly.plot(PIE, trace, layout);
  })
}
function buildBubble(sampleID) {
  url = '/samples/'+sampleID;
  Plotly.d3.json(url, function(response) {

      console.log(response.samples);
      var trace1 = {
          x: response.otu_ids,
          y: response.sample_values,
          text:response.otu_labels,
          mode: 'markers',
          marker: {
              size: response.sample_values,
              colorscale: 'Rainbow',
              color: response.otu_ids,
              text: response.otu_labels
          }
      };

      var data = [trace1];
    
      var layout = {
          title: "Biodiversity Bubble", 
          height: 700,
          width: 1800,
          
        
          xaxis: {
            title: {
              text: 'OTU ID',
              font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
              }
            },
          },
          yaxis: {
            title: {
              text: 'Number of Samples',
              font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
              }
            }
          }
        };
        
      var PLOT = document.getElementById('bubble');
      Plotly.newPlot(PLOT, data, layout);
  });
}

function updatePieChart(newdata) {
  url='/samples/'+newdata;
  Plotly.d3.json(url, function(data){

      var PIE = document.getElementById('pie');
      
      var trace=getPieChartData(data);

      Plotly.restyle(PIE, "labels", [trace[0].labels]);
      Plotly.restyle(PIE, "values", [trace[0].values]);
  })
}


function updateBubbleChart(newdata) {
  url='/samples/'+newdata;
  Plotly.d3.json(url, function(data){
      console.log(data)
      var PLOT = document.getElementById('bubble');
      
      var trace = {
          x: data.otu_ids,
          y: data.sample_values,
          text:data.otu_labels
          };
      
      console.log(trace.x)
      var data = [trace];

      Plotly.restyle(PLOT, "x", [trace.x]);
      Plotly.restyle(PLOT, "y", [trace.y]);
      lotly.restyle(PLOT, "text", [trace.text]);
      Plotly.restyle(PLOT, "marker.color", [trace.x]);
  })
}
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
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
      buildPie(firstSample);
      buildBubble(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    updatePieChart(newSample)
    updateBubbleChart(newSample)
    buildMetadata(newSample);
  }
  

  // Initialize the dashboard
  init();
  