// Imports the classes from classes.js
import { Box, Prisoner, Simulation } from './classes.js';

// Event listener for dropdown
document.getElementById('options').addEventListener('change', function() {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected content section
    var selectedValue = this.value;
    var selectedContent = document.getElementById('content' + selectedValue);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
});

// Event listener for the run button for option 1
document.getElementById("option1-button").addEventListener("click", function() {
    let option1 = new Simulation();
    option1.simulate();
    // If the prisoners won
    if (option1.prisonersWon){
        document.getElementById("option1-result").innerText = "The Prisoners Won! :)";
    }
    // If the prisoners lost
    else {
        document.getElementById("option1-result").innerText = "The Prisoners Lost! :(";
    }
    document.getElementById("option1-longest-loop").innerText = `Longest Loop: ${option1.longestLoop}`;
    document.getElementById("option1-found-count").innerText = `Number of Prisoners that found their number: ${option1.foundCount}`;
    
    // Making sure the previous tables are cleared
    document.getElementById("option1-loops").innerHTML = "";

    option1.loops.forEach(function(loop, index){
        // Create a container div for each loop
        let loopContainer = document.createElement("div");
        loopContainer.classList.add("loop-container");
    
        // Loop Header: Loop Number (e.g., Loop 1)
        let loopNumber = document.createElement("h2");
        loopNumber.innerText = `Loop ${index + 1}`;
        loopContainer.appendChild(loopNumber);
    
        // Loop Length: (e.g., Length: 50)
        let loopLength = document.createElement("p");
        loopLength.innerText = `Length: ${loop.length}`;
        loopContainer.appendChild(loopLength);
    
        // Create Table for the Loop
        let table = document.createElement("table");
        let headerRow = document.createElement("tr");
    
        // Table Headers: # | Box Number | Number Inside
        let numRowHeader = document.createElement("th");
        numRowHeader.innerText = "#";
        headerRow.appendChild(numRowHeader);

        let boxRowHeader = document.createElement("th");
        boxRowHeader.innerText = "Box Number";
        headerRow.appendChild(boxRowHeader);
    
        let paperRowHeader = document.createElement("th");
        paperRowHeader.innerText = "Number Inside";
        headerRow.appendChild(paperRowHeader);
    
        // Set the background color for the header row
        headerRow.style.backgroundColor = "lightgray";

        table.appendChild(headerRow);
    
        // Adding data rows to the table
        loop.forEach(function(pair, index) {
            let row = document.createElement("tr");

            let numCell = document.createElement("td");
            let boxCell = document.createElement("td");
            let paperCell = document.createElement("td");

            numCell.innerText = index + 1;
            boxCell.innerText = pair[0];
            paperCell.innerText = pair[1];

            numCell.style.backgroundColor = "lightgray";

            row.appendChild(numCell)
            row.appendChild(boxCell);
            row.appendChild(paperCell);

            table.appendChild(row);
        });
    
        // Apply styles to the table cells
        table.style.border = "1px solid black";
        table.style.borderCollapse = "collapse";
        table.querySelectorAll("td, th").forEach(cell => {
            cell.style.border = "1px solid black";
            cell.style.padding = "5px";
            cell.style.textAlign = "center";
        });
    
        // Append the table to the loop container
        loopContainer.appendChild(table);
    
        // Append the loop container to the main loops div
        document.getElementById("option1-loops").appendChild(loopContainer);
    });
});

// Event listener for the run button for option 2
document.getElementById("option2-button").addEventListener("click", function() {
    const input = document.getElementById("option2-input");
    const numSimulations = parseInt(input.value, 10);

    // If the input is not a number or is negative, it prompts the user to enter another number
    if (isNaN(numSimulations) || numSimulations <= 0) {
        alert("Please enter a valid positive number.");
    } else {
        // Clear previous data first
        document.getElementById("option2-colorcode").innerHTML = "";
        document.getElementById("option2-found-counts-barchart").innerHTML = "";
        document.getElementById("option2-longest-loop-barchart").innerHTML = "";

        // Tooltip to show values of bars
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("visibility", "hidden")
            .style("pointer-events", "none");
        
        // Run the simulation
        const result = option2simulation(numSimulations);
        document.getElementById("option2-result").innerText = `Number of Prisoner Wins: ${result[0].toLocaleString()} (${((result[0] / numSimulations) * 100).toFixed(2)}%)`;

        // Set the dimensions and margins of the graphs
        const margin = {top: 30, right: 30, bottom: 70, left: 70},
            width = 1500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
        // ------------------------------------------- Color Code -------------------------------------------
        
        let table = document.createElement("table");

        // Green row
        let greenRow = document.createElement("tr");
        let greenColorCell = document.createElement("td");
        greenColorCell.style.backgroundColor = "green";
        greenColorCell.style.width = "30px";
        greenColorCell.style.height = "30px";
        let greenCellDef = document.createElement("td");
        greenCellDef.innerText = "Where the prisoners won";
        greenRow.appendChild(greenColorCell);
        greenRow.appendChild(greenCellDef);

        // Red row
        let redRow = document.createElement("tr");
        let redRowCell = document.createElement("td");
        redRowCell.style.backgroundColor = "red";
        redRowCell.style.width = "30px";
        redRowCell.style.height = "30px";
        let redCellDef = document.createElement("td");
        redCellDef.innerText = "Where the prisoners lost";
        redRow.appendChild(redRowCell);
        redRow.appendChild(redCellDef);

        // Append rows to the table
        table.appendChild(greenRow);
        table.appendChild(redRow);

        // Apply styles to the table cells
        table.style.border = "1px solid black";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "20px";
        table.querySelectorAll("td, th").forEach(cell => {
            cell.style.border = "1px solid black";
            cell.style.padding = "5px";
            cell.style.textAlign = "center";
        });

        // Append the table to the div
        document.getElementById("option2-colorcode").appendChild(table);
        
        // ------------------------------------------- Longest Loops -------------------------------------------

        // Making barchart for Longest Loops - #option2-longest-loop-barchart:
        const longestLoops = result[1];
        
        // Append the SVG object to the div
        const longestLoops_svg = d3.select("#option2-longest-loop-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis properties
        let x = d3.scaleBand()
            .range([0, width])
            // Domain of x-axis is from 1-100
            .domain(Array.from({ length: 100 }, (_, i) => i + 1))
            .padding(0.2);

        longestLoops_svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis properties
        let y = d3.scaleLinear()
            .domain([0, Math.max(...longestLoops)])
            .range([height, 0]);

        longestLoops_svg.append("g")
            .call(d3.axisLeft(y));

        // Bars attributes
        longestLoops_svg.selectAll("rect")
            .data(longestLoops)
            .join("rect")
            .attr("x", (dataValue, i) => x(i + 1))
            .attr("y", dataValue => y(dataValue))
            .attr("width", x.bandwidth())
            .attr("height", dataValue => height - y(dataValue))
            .attr("fill", (dataValue, i) => (i + 1) <= 50 ? "green" : "red")

            // Hovering over a bar
            .on("mouseover", function(event, dataValue) {
                tooltip.style("visibility", "visible")
                    .text(`Frequency: ${dataValue}`);
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.5);
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
            });

        // X-axis label
        longestLoops_svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 20)
            .text("Longest Loop");

        // Y-axis label
        longestLoops_svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .text("Frequency");

        // ------------------------------------------- Found Counts -------------------------------------------

        // Making barchart for Found Counts - #option2-found-counts-barchart:
        const foundCounts = result[2];

        // Append the SVG object to the div
        const foundCounts_svg = d3.select("#option2-found-counts-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis properties
        x = d3.scaleBand()
            .range([0, width])
            // Domain of x-axis is from 0-100
            .domain(Array.from({ length: 101 }, (_, i) => i))
            .padding(0.2);

        foundCounts_svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis properties
        y = d3.scaleLinear()
            .domain([0, Math.max(...foundCounts)])
            .range([height, 0]);

        foundCounts_svg.append("g")
            .call(d3.axisLeft(y));

        // Bars attributes
        foundCounts_svg.selectAll("rect")
            .data(foundCounts)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d))
            .attr("fill", (d, i) => i === 100 ? "green" : "red")

            // Hovering over a bar
            .on("mouseover", function(event, dataValue) {
                tooltip.style("visibility", "visible")
                    .text(`Frequency: ${dataValue}`);
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.5);
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
            });
        
        // X-axis label
        foundCounts_svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 20)
            .text("Number of Prisoners who found their number");

        // Y-axis label
        foundCounts_svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .text("Frequency");
    }
});

// Event listener for the run button for option 3
document.getElementById("option3-button").addEventListener("click", function() {
    const samplesInput = document.getElementById("option3-input-1");
    const simulationsInput = document.getElementById("option3-input-2");

    const numSamples = parseInt(samplesInput.value, 10);
    const numSimulations = parseInt(simulationsInput.value, 10);

    // If the inputs are not a number or are negative, it prompts the user to enter another number
    if ((isNaN(numSamples) || numSamples <= 0) || isNaN(numSimulations) || numSimulations <= 0) {
        alert("Please enter valid positive numbers.");
    } else {
        // Clear previous histogram first
        document.getElementById("option3-histogram").innerHTML = "";

        const result = option3simulation(numSamples, numSimulations);
        const data = result[0];

        document.getElementById("mean-wins").innerText = `Mean Wins: ${result[1]} (${((result[1] / numSimulations) * 100).toFixed(2)}%)`;
        document.getElementById("min-wins").innerText = `Minimum Wins: ${Math.min(...data)}`;
        document.getElementById("max-wins").innerText = `Maximum Wins: ${Math.max(...data)}`;

        // Making the Histogram:
        // The dimensions and margins of the chart
        const margin = {top: 30, right: 30, bottom: 50, left: 50},
            width = 1200 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Append the SVG object to the div
        const svg = d3.select("#option3-histogram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X-axis (# of Wins)
        const x = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([0, width]);

        // Generate the histogram data
        const histogram = d3.histogram()
            .value(d => d)
            .domain(x.domain())
            .thresholds(x.ticks(10));

        const bins = histogram(data);

        // Y-axis (Frequency)
        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);

        // Draw the bars
        svg.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0))
            .attr("height", d => height - y(d.length))
            .attr("fill", "#69b3a2")
            
            // Hovering over a bar
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.5);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
            });

        // Add the X-axis to the chart
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add the Y-axis to the chart
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // X-axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 15)
            .text("Number of Wins");

        // Y-axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .text("Frequency");
    }
});

// The simulation for option 2
function option2simulation(simulations) {
    let wins = 0;
    let longestLoops = new Array(100).fill(0);
    let foundCounts = new Array(101).fill(0);
    for (let i = 0; i < simulations; i++) {
        let currentSim = new Simulation();
        currentSim.simulate();
        if (currentSim.prisonersWon) wins++;
        longestLoops[currentSim.longestLoop - 1]++;
        foundCounts[currentSim.foundCount]++;
    }
    return [wins, longestLoops, foundCounts];
}

// The simulation for option 3
function option3simulation(samples, simulations) {
    let datapoints = [];
    let sum = 0;
    let mean = 0;
    for (let i = 0; i < samples; i++) {
        let winsCount = option2simulation(simulations)[0];
        datapoints.push(winsCount);
        sum += winsCount;
    }
    mean = (sum / samples).toFixed(2);
    return [datapoints, mean];
}
