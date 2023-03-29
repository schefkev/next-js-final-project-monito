'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function StackedBarChart() {
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
        label: 'Income',
        data: [30000, 30000, 30000, 30000],
        backgroundColor: 'rgba(32, 214, 144, 1)',
      },
      {
        label: 'Mortgage',
        data: [37500, 37500, 37500, 37500],
        backgroundColor: 'rgba(1, 98, 255, 1)',
      },
      {
        label: 'Expenses',
        data: [0, 0, 12000],
        backgroundColor: 'rgba(250, 0, 0, 1)',
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: 'circle',
        },
        title: {
          text: 'Income-Expense Report',
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
