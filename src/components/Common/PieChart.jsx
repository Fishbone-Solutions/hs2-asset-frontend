import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  console.log("data", data);
  // Prepare data for the Pie chart based on the prop data
  const labels = data.map((item) => item.status);
  const totals = data.map((item) => item.total);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: totals,
        backgroundColor: [
          "#E38627",
          "#C13C37",
          "#6A2135",
          "#616161",
          "#7e7e7e",
          "#969696",
        ],
        borderColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "300px", width: "400px" }}>
      {" "}
      {/* Set the desired height and width */}
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />{" "}
      {/* Disable aspect ratio to allow height control */}
    </div>
  );
};

export default PieChart;
