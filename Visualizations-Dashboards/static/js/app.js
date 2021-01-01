var dropdownMenu = d3.select("#selDataset");

function init() {
    loadIDs();
    barPlot(null);
    loadDemographics(null);
    loadBubble(null);
    //loadGauge(null);
}

function loadIDs() {
    // Use D3 to select the dropdown menu
    //var dropdownMenu = d3.select("#selDataset");
    d3.json("data/samples.json").then((importedData) => {
        ids = importedData.names;
        ids.forEach((id) => {
            var option = dropdownMenu.append("option");
            option.text(id);
        });
    });
}

function optionChanged(selectedValue) {
    console.log(selectedValue);
    barPlot(selectedValue);
    loadDemographics(selectedValue);
    loadBubble(selectedValue);
    //loadGauge(selectedValue);
}

// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as importedData
function barPlot(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.samples;
        
        console.log(selectedID);

        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        /*filteredData[0].sample_values.sort((sample1, sample2) => sample1 - sample2);
        // Slice the first 10 objects for plotting
        filteredData = filteredData.slice(0, 10);

        // Reverse the array due to Plotly's defaults
        filteredData = filteredData.reverse();*/
    
        // Create your trace.
        xValues = filteredData[0].sample_values.slice(0,10).reverse();
        yValues = filteredData[0].otu_ids.slice(0,10).reverse();
        dataLabels = filteredData[0].otu_labels.slice(0,10).reverse();
        var trace = {
            x: xValues,
            y: yValues.map((d, i) => i),
            text: dataLabels,
            type: "bar",
            orientation: "h"
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            yaxis: {
                tickvals: yValues.map((d, i) => i),
                ticktext: yValues.map(d => "OTU "+d.toString()),
            },
            margin: {
            l: 75,
            r: 75,
            t: 75,
            b: 75
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", chartData, layout);
    });
}

async function loadDemographics(selectedID) {
    var demographicsDiv = d3.select("#sample-metadata");
    demographicsDiv.html("");
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.metadata;
        var filteredData = data.filter(row => row.id == selectedID);
        console.log(filteredData);
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            var span = demographicsDiv.append("span");
            span.text(key+": "+value);
            demographicsDiv.append("br");
        });
        loadGauge(filteredData[0].wfreq)
    });
}

function loadBubble(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.samples;

        console.log(selectedID);

        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        // Create your trace.
        xValues = filteredData[0].otu_ids.reverse();
        yValues = filteredData[0].sample_values.reverse();
        textValues = filteredData[0].otu_labels.reverse();
        var trace = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            marker: {
                size: yValues,
                color: xValues
            },
            text: textValues
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            xaxis: {
                title: {
                    text: "OTU ID"
                }
            },
            showlegend: false,
            margin: {
            l: 40,
            r: 40,
            t: 40,
            b: 40
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bubble", chartData, layout);
    });
}

init();