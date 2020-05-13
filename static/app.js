//Create function for building the charts and graphs
function Charts(sampleId) {
    d3.json("data/samples.json").then((BellyButtonData) => {
        var data = BellyButtonData.samples;
        var array = data.filter(s => s.id == sampleId);
        var sample = array[0];
        var otuID = sample.otu_ids;
        var otuLabel = sample.otu_labels;
        var values = sample.sample_values;
        
//Bar chart
        var trace1 = [{
            type: "bar",
            orientation: "h",
            x: values.slice(0, 10).reverse(),
            y: otuID.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otuLabel.slice(0, 10).reverse(),
        }];
        var layout1 = {
            title: "Top 10 OTUs by Sample",
            xaxis: {title: "Number of OTUs Present"},
            autosize: true,
        };
        Plotly.newPlot("bar", trace1, layout1);
         
//Bubble chart
        var trace2 = [{
            type: "scatter",
            mode: "markers",
            x: otuID,
            y: values,
            text: otuLabel,
            marker: {
                size: values,
                color: otuID,
                colorscale: "earth"
            }
        }];
        var layout2 = {
            title: "Present Microbes by Sample",
            xaxis: {title: "OTU ID#"},
            yaxis: {title: "Number of OTUs"}
        };
        Plotly.newPlot("bubble", trace2, layout2);

    });
}

//fCreate function for metadata
function metaData(sampleId) {
    d3.json("data/samples.json").then((BellyButtonData) => {
        var metadata = BellyButtonData.metadata;
        var metaArr = metadata.filter(m => m.id == sampleId);
        var result = metaArr[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            var display = `${key}: ${value}`;
            panel.append("p").text(display);
        });
    });
}

//Create function for new option choice
function optionChanged(newSampleId) {
    Charts(newSampleId);
    metaData(newSampleId);
}

//Initiaze the function and defaults
function init() {
    var selector = d3.select("#selDataset");
    d3.json("data/samples.json").then((BellyButtonData) => {
        var names = BellyButtonData.names;
        names.forEach((sampleId) => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });
        var sampleId = names[0];
        Charts(sampleId);
        metaData(sampleId);
    });
}
init();