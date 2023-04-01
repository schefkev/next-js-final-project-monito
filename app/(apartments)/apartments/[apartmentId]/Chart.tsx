/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { gql, useQuery } from '@apollo/client';
import type { ChartData, ChartOptions } from 'chart.js';
import Chart, { registerables } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Stats } from '../../../../database/stats';

interface LineProps {
  options: ChartOptions<'bar'>;
  data: ChartData<'bar'>;
}

const getStats = gql`
  query Query($apartmentId: String) {
    stats(apartmentId: $apartmentId) {
      rent
      mortgage
      expense
      month
      year
    }
  }
`;

export default function StackedBarChart(props: { apartmentId: number }) {
  const { data: chartStats, refetch } = useQuery(getStats, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { apartmentId: props.apartmentId },
  });

  const formattedStats = chartStats?.stats?.map((stat: Stats) => ({
    label: stat.month,
    data: [stat.rent, stat.mortgage || 0, stat.expense || 0],
  }));

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
        data: formattedStats?.map((stat: Stats) => stat.data[0]) ?? [
          30000, 30000, 30000, 30000,
        ],
        backgroundColor: 'rgba(32, 214, 144, 1)',
      },
      {
        label: 'Mortgage',
        data: formattedStats?.map((stat: Stats) => stat.data[1]) ?? [
          37500, 37500, 37500, 37500,
        ],
        backgroundColor: 'rgba(1, 98, 255, 1)',
      },
      {
        label: 'Expenses',
        data: formattedStats?.map((stat: Stats) => stat.data[2]) ?? [
          0, 0, 12000,
        ],
        backgroundColor: 'rgba(250, 0, 0, 1)',
      },
    ],
  };
  const options: ChartOptions<'bar'> = {
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

  Chart.register(...registerables);
  return (
    <div className="p-8 h-96">
      <Bar data={data} options={options} />
    </div>
  );
}
