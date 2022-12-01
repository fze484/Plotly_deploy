function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildBubbles(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubbles(newSample);
  buildGauge(newSample);
  
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var s = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var rArray = s.filter(sObj => sObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = rArray[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var idees = result.otu_ids;
    var labs = result.otu_labels;
    var vals = result.sample_values;

    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    // var y = values.sort((a,b) => a - b).reverse();
    var xticks = vals.slice(0,10).reverse()
    var yticks = idees.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    console.log(yticks);

    // 8. Create the trace for the bar chart. 
     var barData = {
    x: xticks,
    y: yticks,
    orientation: 'h',
    text: [labs],
    type: "bar",
    options: {
      maintainAspectRatio: false,
    }
  };
   var data = [barData];
   // 9. Create the layout for the bar chart. 
     var barLayout = {
     title:'Top 10 bacterial species (OTUs)',
     height: 425,
     //smargin: { t: 30, l: 150 }
   };
   
    // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", data, barLayout);
   });
};

// Bar and Bubble charts
// Create the buildCharts function.
function buildBubbles(samp) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    var sa = data.samples
    var reArray = sa.filter(sObje => sObje.id == samp);
    var results = reArray[0];

    var idees = results.otu_ids;
    var labs = results.otu_labels;
    var vals = results.sample_values;


    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot("bar", data, barLayout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: idees,
      y: vals,
      text: [labs],
      mode: 'markers',
      marker: {
      color: idees,
      size: vals,      
  }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria cultures per sample',
      showlegend: false,
      margin: {t: 0},
      hovermode: "closest",
      margin: {t : 30},
      //height: 600,
      //width: 600
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout); 
  });
};

// Gauge chart
// Create the buildGauge function.

  function buildGauge(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the washing frequency.
    var s = data.metadata
    var resArray = s.filter(sObje => sObje.id == sample);
    var rslts = resArray[0];
    var freq = parseFloat(rslts.wfreq);
   
    // Create the trace for the gauge chart.
    var gaugeData = [{ 
      value: freq,
      title:  { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"} ,
      subtitle: {
        display: true,
        text: 'Scrubs per week'
      },  
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
   
        ]
      }    
    } 
    ];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = {  
      width: 500, 
      height: 425, 
      margin: { t: 0, b: 0 } 
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}



