
//Importing the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Reading the json data
d3.json(url).then(function(data) {
	console.log(data);
});

init();

// Display the default plot
function init() {


	//Using D3 to select dropdown menu
	let dropdownMenu = d3.select("#selDataset");

	//Using D3 to get sample names for the drop down selector
	d3.json(url).then((data) => {

	
		//Setting a variable for sample names
		let names = data.names;
		

		//Adding samples to dropdown menu
		names.forEach((id) => {

			//Displaying id while iterating the loop
			//console.log(id);

			dropdownMenu.append("option")
			.text(id)
			.property("value",id);

		});

		//Setting the first sample 
		let sample_one = names[0];

		//Display value of sample_one
		console.log(sample_one);


		//Build the initial plots
		buildMetaData(sample_one);
		buildBarChart(sample_one);
		buildBubbleChart(sample_one);
		buildGaugeChart(sample_one);

		});

	};



//Function to build Bar Chart

function buildBarChart(sample) {

	//Using D3 to retrieve data
	d3.json(url).then((data) => {

	//Retrieve sample data
	let sampleInfo = data.samples;

	//Filter based on the value of sample
	let value = sampleInfo.filter(result => result.id ==sample);

	//Get the first index from the array
	let valueData = value[0];

	///Getting otu_ids, labels and sample values
	let otu_ids = valueData.otu_ids;
	let otu_labels = valueData.otu_labels;
	let sample_values = valueData.sample_values;

	//Display the data 
	
	console.log(otu_ids, otu_labels, sample_values);

	//Setting top 10 items to display in descending order
	let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
	let xticks = sample_values.slice(0,10).reverse();
	let labels = otu_labels.slice(0,10).reverse();

	//Setting up trace for the bar chart
	let trace = {
		x: xticks,
		y: yticks,
		text: labels,
		type:"bar",
		orientation: "h"

	};

	let traceData = [trace];

	//Setting up the layout
	let layout = {
		title: "Top 10 OTUs Present"
	};

	//Plotting the bar chart

	Plotly.newPlot("bar", traceData, layout)
	
	});

}

// Function to update selection on dropdown
function optionChanged(value) {

	//Display the new value
	console.log(value);
	
		buildMetaData(value);
		buildBarChart(value);
		buildBubbleChart(value);
		buildGaugeChart(value);


};

//Function to build Bubble Chart
function buildBubbleChart(sample) {

	//Using D3 to retrieve the data
	d3.json(url).then((data) => {

	//Retrieve sample data
	let sampleInfo = data.samples;
	
	//Filter based on the value of sample
	let value = sampleInfo.filter(result => result.id ==sample);

	//Get the first index from the array
	let valueData = value[0];

	///Getting otu_ids, labels and sample values
	let otu_ids = valueData.otu_ids;
	let otu_labels = valueData.otu_labels;
	let sample_values = valueData.sample_values;

	//Display the data 
	console.log(otu_ids, otu_labels, sample_values);

	//Set up trace for bubble chart
	let trace1 = {
		x: otu_ids,
		y: sample_values,
		text: otu_labels,
		mode: "markers",
		marker: {
			size: sample_values,
			color: otu_ids,
			colorscale: "Earth"

		}
	

	};

	//Set up the layout
	let layout = {
		title: "Bacteria per Sample",
		hovermode: "closest",
		xaxis: {title: "OTU ID"},
	};

	//Plotting the bubble chart
	Plotly.newPlot("bubble", [trace1], layout)
	

	});

};


//Function to populate metadata information
function buildMetaData(sample) {

	//Use D3 to retrieve the data
	d3.json(url).then((data) => {

	//Retrieve the metadata 
	let metadata = data.metadata;

	//Filter based on the value of sample
	let value = metadata.filter(result => result.id ==sample);

	//Display the value
	console.log(value);

	//Getting the first index from the array
	let valueData = value[0];

	//Clearing the metadata
	d3.select("#sample-metadata").html("");

	//Adding each key, value pair to the panel
	Object.entries(valueData).forEach(([key, value]) => {

		//display the key, value pairs 
		console.log(key, value);

		d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

	});


    });

};

//Function to build Gauge Chart
function buildGaugeChart(sample) {

	//Use D3 to retrieve the data
	d3.json(url).then((data) => {

	//Retrieve the metadata 
	let metadata = data.metadata;

	//Filter based on the value of sample
	let value = metadata.filter(result => result.id ==sample);

	//Display the value
	console.log(value);

	//Getting the first index from the array
	let valueData = value[0];

	//Reading wash frequency
	let washFrequency = Object.values(valueData)[6];

	//Setting up trace for the gauge chart
	let trace2 = {
		value: washFrequency,
		domain: {x: [0,1], y: [0,1]},
		title: {
			text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
			font: {color: "black", size: 16}
			},

		type: "indicator",
		mode: "gauge+number",
		gauge: {
		axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
		bar: {color: "orange"}, 
		steps: [
		    {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                    {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                    {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                    {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                    {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                    {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                    {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                    {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                    {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                    {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
		]

	   }

	};

	//Setting up the layout
	let layout = {
		width: 400,
		height: 400,
		margin: {t: 0, b:0}
	};

	//Plotting the gauge chart with Plotly
	Plotly.newPlot("gauge",[trace2], layout)

   });

};













