import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Inital count',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 10]
  },
  {
    name: 'Undefined count',
    type: 'column',
    data: [124, 115, 117,112,114, 113, 110, 121, 17]
  },
  {
	    name: 'Recurrent count',
	    type: 'column',
	    data: [11, 6, 7, 8, 9, 10, 12, 31, 5]
	   },
	  
  {
    name: 'Initial accumlation',
    type: 'area',
    data: [23, 34, 56, 83, 96, 118, 155, 176, 186]
  },
  
  {
    name: 'Recurrent accumlation',
    type: 'line',
    data: [11, 17, 24, 32,41, 51,63, 94, 99]
  }
];




export default function SurgeryAccumlation() {
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3,4] },
    plotOptions: { bar: { columnWidth: '12%', borderRadius: 5 } },
    fill: { type: ['solid','solid','solid','gradient',  'solid']},
    labels: [
      '2015',
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023'
    ],
    xaxis: { type: 'string' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} `;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Summary of Initial vs Recurrent Glioma Surgeries (Yearly and Cumulative Accrual), 2015-2023" subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
