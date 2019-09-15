// TODO: de-uglify this website...

function initCharts(sample) {

   // Bubble chart
   var graphData = d3.json(`/samples/${sample}`).then(function(data) {
      var data = [data][0];
      var trace = {
         x: data.otu_ids,
         y: data.sample_values,
         text: data.otu_labels,
         mode: 'markers',
         marker: {
            size: data.sample_values,
            color: data.otu_ids
         }
      };

      var layout = {
         margin: {
            t: 30,
            b: 100 
         } 
      };

      Plotly.newPlot('bubble', [trace], layout);
   });

   // Pie chart
   var otherGraphData = d3.json(`/samples/${sample}`).then(function(data) {
      var rawdata = [data];
      var sorteddata = rawdata.sort(function(a, b) {
         return a.sample_values - b.sample_values
      });
      var piedata = [sorteddata][0][0];
      var trace = {
         values: piedata.sample_values.slice(0,9),
         labels: piedata.otu_ids.slice(0,9),
         hoverinfo: piedata.otu_labels.slice(0,9),
         type: 'pie'
      };
      var layout = {
         margin: {
            t: 30,
            b: 100 
         } 
      };

      Plotly.newPlot('pie', [trace], layout);
   });

   // Metadata
   var selector = d3.select("#sample-metadata")
   selector.html("")

}

function buildMetadata(sample) {
   // Use `d3.json` to fetch the metadata for a sample
   var metaData = d3.json(`/metadata/${sample}`)

   // Use d3 to select the panel with id of `#sample-metadata`
   var selector = d3.select("#sample-metadata")

   // Use `.html("") to clear any existing metadata
   selector.html("")

   // Use `Object.entries` to add each key and value pair to the panel
   // Hint: Inside the loop, you will need to use d3 to append new
   // tags for each key-value in the metadata.
   var metaData = d3.json(`/metadata/${sample}`).then(function(metadata) {
      for (var [key, value] of Object.entries(metadata)) {
         if (key == 'WFREQ') {
            buildGauge(value)
         } 
         selector.append(function() {
            return document.createElement("p")
         })
         // TODO: Why doesn't this work?
         //.text(`<b>${key}</b>: ${value}`)
         .text(`${key}: ${value}`)
      };
   });

}

function buildGauge(freq) {
   if (0 <= freq && freq <= 3) {
      var barColor = 'red';
   }
   if (3 < freq && freq <= 6) {
      var barColor = 'yellow';
   }
   if (6 < freq) {
      var barColor = 'green';
   }
   var data = [
      {
         domain: {
            x: [0, 1], 
            y: [0, 1]
         }, 
         value: freq,
         title: {
            text: "Belly Button Washing Frequency",
            font: {size: 24}
         }, 
         type: "indicator",
         mode: "gauge+number",  // TODO: Don't use a number, make an SVG element and transform it
         gauge: {
            axis: {
               range: [0, 9], 
               tickwidth: 1,
               tickcolor: "white"
            },
            bar: {
               color: barColor
            },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
               {
                  range: [0, 1],
                  color: ''
               },
               {
                  range: [1, 2],
                  color: ''
               },
               {
                  range: [2, 3],
                  color: ''
               },
               {
                  range: [3, 4],
                  color: ''
               },
               {
                  range: [4, 5],
                  color: ''
               },
               {
                  range: [5, 6],
                  color: ''
               },
               {
                  range: [6, 7],
                  color: ''
               },
               {
                  range: [7, 8],
                  color: ''
               },
               {
                  range: [8, 9],
                  color: ''
               }
            ]
         }
      }
   ];

   var layout = {width: 500, height: 400, margin: {t: 25, r: 25, l: 25, b: 25},
      font: {color: "darkblue", family: "Arial"}};

   Plotly.newPlot('gauge',data,layout);
}

function buildCharts(sample) {
   var graphData = d3.json(`/samples/${sample}`).then(function(data) {
      var data = [data][0];
      var trace = {
         x: data.otu_ids,
         y: data.sample_values,
         mode: 'markers',
         marker: {
            size: data.sample_values
         }
      };
      var layout = { margin: { t: 30, b: 100 } };
      Plotly.restyle('bubble', "x", [trace.x]);
      Plotly.restyle('bubble', "y", [trace.y]);
      Plotly.restyle('bubble', "marker.size", [trace.marker.size]);
   })

   var otherGraphData = d3.json(`/samples/${sample}`).then(function(data) {
      var rawdata = [data];
      var sorteddata = rawdata.sort(function(a, b) {
         return a.sample_values - b.sample_values
      });
      var piedata = [sorteddata][0][0];
      var trace = {
         values: piedata.sample_values.slice(0,9),
         labels: piedata.otu_ids.slice(0,9),
         hoverinfo: piedata.otu_labels.slice(0,9),
         type: 'pie'
      };
      var layout = {
         margin: {
            t: 30,
            b: 100 
         } 
      };

      Plotly.restyle('pie', "values", [trace.values]);
      Plotly.restyle('pie', "labels", [trace.labels]);
      Plotly.restyle('pie', "hoverinfo", [trace.hoverinfo]);
   });

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
      initCharts(firstSample);
      buildMetadata(firstSample);
   });
}

function optionChanged(newSample) {
   // Fetch new data each time a new sample is selected
   buildCharts(newSample);
   buildMetadata(newSample);
}

// Initialize the dashboard
init();
