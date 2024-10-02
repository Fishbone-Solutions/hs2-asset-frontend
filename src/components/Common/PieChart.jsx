import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Register the plugin

const PieChart = ({ data }) => {
  console.log("data", data);

  // Mapping of labels to specific colors
  const colorMapping = {
    "Listing": "#51bcda",
    "Live": "#da2727",
    "Sold": "#6bd098",
  };

  // Default color if a label doesn't match
  const defaultColor = "#cccccc";

  // Prepare data for the Pie chart based on the prop data
  const labels = data.map((item) => item.status);
  const totals = data.map((item) => item.total);
  const totalSum = totals.reduce((acc, val) => acc + val, 0); // Calculate the sum of all totals

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: totals,
        backgroundColor: labels.map(label => colorMapping[label] || defaultColor), // Set background color based on the label
        borderColor: labels.map(label => colorMapping[label] || defaultColor), // Set border color based on the label
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value) => {
          // Display the total number of records in each slice
          return value;
        },
        font: {
          weight: "bold",
          size: 14,
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "400px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
