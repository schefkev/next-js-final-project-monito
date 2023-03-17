'use client';

import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

export default function PieChart() {
  const data = {
    backgroundColor: [
      'rgba(32, 214, 144, 1)',
      'rgba(1, 98, 255, 1)',
      'rgba(250, 0, 0, 1)',
    ],
    labels: ['Income', 'Mortgage', 'Expenses'],
    datasets: [
      {
        label: 'YTD',
        data: [120000, 140000, 12000],
        backgroundColor: [
          'rgba(32, 214, 144, 1)',
          'rgba(1, 98, 255, 1)',
          'rgba(250, 0, 0, 1)',
        ],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'YTD Overall',
      },
    },
    options: {
      responsive: true,
    },
  };
  return (
    <div className="p-8 h-96">
      <Pie data={data} options={options} />
    </div>
  );
}
