import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const adjustPercentages = (rawPercentages: any) => {
    let sum = 0;
    let floorSums = 0;
    const result = rawPercentages.map((value: any) => {
      const floorValue = Math.floor(value);
      sum += value;
      floorSums += floorValue;
      return floorValue;
    });
    let roundError = Math.round(sum) - floorSums;
    for (let i = 0; i < result.length && roundError > 0; i++) {
      result[i]++;
      roundError--;
    }
    return result;
  }

  return (
    <div style={{
      height: 350,
      width: 300,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Pie
        data={data}
        options={{
          plugins: {
            legend: {
              position: 'bottom' as const,
            },
            tooltip: {
              enabled: false,
            },
            datalabels: {
              formatter: (value: any, context: any) => {
                const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const rawPercentages = context.chart.data.datasets[0].data.map((v: number) => (v / total) * 100);
                const adjustedPercentages = adjustPercentages(rawPercentages);
                const percentage = adjustedPercentages[context.dataIndex];
                return `${percentage}%`;
              },
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
