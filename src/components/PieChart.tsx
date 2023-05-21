import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
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
              position: 'top' as const,
            },
            tooltip: {
              enabled: false,
            },
            datalabels: {
              formatter: (value: any, context: any) => {
                const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
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
