import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

interface GateChartProps {
  inputs: boolean[];
  timeSeries: { time: number; inputs: boolean[]; output: boolean }[];
}

const GateChart: React.FC<GateChartProps> = ({ inputs, timeSeries }) => {
  const latestTime = timeSeries.length ? timeSeries[timeSeries.length - 1].time : 0;

  const series = useMemo(() => {
    const inputSeries = inputs.map((_, idx) => ({
      name: `IN${idx + 1}`,
      data: timeSeries?.map((point) => ({ x: point.time, y: point.inputs[idx] ? 1 : 0 })) ?? [],
    }));

    const outputSeries = {
      name: 'OUT',
      data: timeSeries?.map((point) => ({ x: point.time, y: point.output ? 1 : 0 })) ?? [],
    };

    return [...inputSeries, outputSeries];
  }, [inputs, timeSeries]);

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      chart: {
        id: 'gate-chart',
        type: 'line',
        height: 200,
        animations: {
          enabled: true,
          dynamicAnimation: { speed: 150 },
        },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: 'stepline',
        width: 2,
      },
      xaxis: {
        type: 'numeric',
        title: { text: 'Time (s)' },
        labels: { formatter: (value: string) => `${parseFloat(value)}s` },
        min: latestTime > 20 ? latestTime - 20 : 0,
        max: latestTime > 20 ? latestTime : undefined,
      },
      yaxis: {
        forceNiceScale: true,
        labels: {
          formatter: (value) => (value >= 1 ? '1' : '0'),
        },
      },
      legend: {
        position: 'top',
      },
      markers: {
        size: 4,
        shape: 'circle',
        hover: {
          size: 5,
        },
      },
      grid: {
        padding: { right: 10, left: 10 },
      },
    }),
    [latestTime]
  );

  return (
    <div className="w-100 d-block">
      <ReactApexChart options={options} series={series} type="line" height={200} />
    </div>
  );
};

export default GateChart;
