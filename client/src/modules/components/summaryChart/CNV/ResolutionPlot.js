import React from "react";
import Plot from "react-plotly.js";

const ResolutionPlot = () => {
  // Assuming you have an array of resolution values
  const resolutionData = [800, 1000, 1200, 900, 1100, 950, 1150, 850, 1050];

  // Specify the number of bins
  const numBins = 10;

  // Calculate the width of each bin
  const binWidth = 100 / numBins;

  // Create an array to hold the x-axis bin values
  const xBins = Array.from({ length: numBins }, (_, index) => {
    const binStart = index * binWidth;
    const binEnd = binStart + binWidth;
    return [binStart, binEnd];
  });

  // Create an array to hold the y-axis counts for each bin
  const yCounts = Array(numBins).fill(0);

  // Calculate the count of resolutions falling into each bin
  resolutionData.forEach((resolution) => {
    const binIndex = Math.floor((resolution - 800) / 100); // Assuming resolution range is 800-1200
    yCounts[binIndex]++;
  });

  // Create an array of image tiles with specified width and color
  const imageTiles = xBins.map(([start, end], index) => {
    const width = `${binWidth}%`;
    const color = `rgb(100, ${100 + index * 15}, 200)`;
    return (
      <div key={index} style={{ width, backgroundColor: color }}>
        <img src="your-image-source" alt={`Tile ${index}`} />
      </div>
    );
  });

  // Create data and layout objects for Plotly
  const data = [
    {
      x: xBins.map(([start, end]) => `${start}-${end}`),
      y: yCounts,
      type: "bar",
    },
  ];

  const layout = {
    title: "Resolution Loading",
    xaxis: {
      title: "Resolution Bins",
    },
    yaxis: {
      title: "Count",
    },
  };

  return (
    <div>
      <div style={{ display: "flex" }}>{imageTiles}</div>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default ResolutionPlot;
