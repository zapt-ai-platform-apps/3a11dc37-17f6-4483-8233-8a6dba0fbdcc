import React from 'react';
import Chart from 'react-apexcharts';

export const ChartComponent = ({ options, series }) => (
  <Chart
    options={options}
    series={series}
    type="line"
    height={300}
  />
);