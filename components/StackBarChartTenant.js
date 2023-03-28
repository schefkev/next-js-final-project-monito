'use client';

import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function StackedBarChartTenant() {
  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Rent',
        data: [30000, 30000, 30000, 30000],
        backgroundColor: 'rgba(32, 214, 144, 1)',
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 5,
          usePointStyle: true,
          pointStyle: 'circle',
        },
        title: {
          text: 'Rental-Report',
          display: true,
          color: '#000',
          font: {
            size: 18,
          },
        },
      },
    },
  };
  return (
    <div className="p-8 h-96">
      <Bar data={data} options={options} />
    </div>
  );
}
