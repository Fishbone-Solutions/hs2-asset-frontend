import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Register the plugin

const PieChart = ({ data }) => {
  console.log("data", data);
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
        backgroundColor: [
          "#51bcda",
          "#da2727",
          "#6bd098",
          "#616161",
          "#7e7e7e",
          "#969696",
        ],
        borderColor: [
          "#51bcda",
          "#da2727",
          "#6bd098",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
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
