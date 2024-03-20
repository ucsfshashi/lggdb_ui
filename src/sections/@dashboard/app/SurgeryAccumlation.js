import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box } from '@mui/material';
import { BaseOptionChart } from '../../../components/charts';
import React, { useEffect, useState } from 'react';
import axios from "axios";

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Initial count',
    type: 'column',
    data: []
  },
  {
    name: 'Undefined count',
    type: 'column',
    data: []
  },
  {
	    name: 'Recurrent count',
	    type: 'column',
	    data: []
	   },
	  
  {
    name: 'Initial Cumulative',
    type: 'area',
    data: []
  },
  
  {
    name: 'Recurrent Cumulative',
    type: 'line',
    data: []
  }
];




export default function SurgeryAccumlation(input) {
	
  const [xyz, setXyz] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(CHART_DATA);
	
	
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
      '2023',
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
  
  
const extractData = async() => {
	  
	  if(xyz<2) {
	      setLoading(true);
	      var path ='/patients/ivsr/summary';
	      var summaryInfo = await axios.get(input.loginContext.apiUrl+""+path, 
	                                  {headers:{
	                                    'Content-Type' :'applicaiton/json',
	                                    'X-Requested-With':'XMLHttpRequest', 
	                                    'UCSFAUTH-TOKEN':input.loginContext.token,
	                                     'tagId':input.loginContext.selTag.tagId,
	                                     'Accept': 'application/json',
	                                  }}
	                                  );
	      if(summaryInfo) {
	    	  summaryInfo = summaryInfo.data;
	    	  var lChartData = chartData;
	    	  
	    	  // I values
	    	  var IValues = summaryInfo.filter(x => x.initalVsRecurrFlag == 'I');
	    	  var cummCnt =0;
	    	  lChartData[0].data =[];
	    	  lChartData[3].data =[];
	    	  
	    	  for(let index=2015; index<=2023; index++)  {
	    		  var lVal = IValues.filter(x=>x.year ==index);
	    		
	    		  if(lVal.length > 0) {
	    			  lChartData[0].data.push(lVal[0].count);
	    			  cummCnt =cummCnt+lVal[0].count
	    		  } else {
	    			  lChartData[0].data.push(0);
	    		  }
	    		  lChartData[3].data.push(cummCnt);
	    	  }
	    	  
	    	  // R Values
	    	  IValues = summaryInfo.filter(x => x.initalVsRecurrFlag == 'R');
	    	  var cummCnt =0;
	    	  lChartData[2].data =[];
	    	  lChartData[4].data =[];
	    	  
	    	  for(let index=2015; index<=2023; index++)  {
	    		  var lVal = IValues.filter(x=>x.year ==index);
	    		
	    		  if(lVal.length > 0) {
	    			  lChartData[2].data.push(lVal[0].count);
	    			  cummCnt =cummCnt+lVal[0].count
	    		  } else {
	    			  lChartData[2].data.push(0);
	    		  }
	    		  lChartData[4].data.push(cummCnt);
	    	  }
	    	  
	    	  
	    	// R Values
	    	  IValues = summaryInfo.filter(x => x.initalVsRecurrFlag == 'N');
	    	  var cummCnt =0;
	    	  lChartData[1].data =[];
	    	  
	    	  for(let index=2015; index<=2023; index++)  {
	    		  var lVal = IValues.filter(x=>x.year ==index);
	    		
	    		  if(lVal.length > 0) {
	    			  lChartData[1].data.push(lVal[0].count);
	    			  cummCnt =cummCnt+lVal[0].count
	    		  } else {
	    			  lChartData[1].data.push(0);
	    		  }
	    	  }
	    	 
	    	  setChartData(lChartData);
	       }
	      setLoading(false);
	      setXyz(xyz+1);
	  }
 };
  
 
 
 
 
 
  useEffect(() => {
		 extractData();
	  }, []);

  return (
    <Card>
      <CardHeader title="Summary of Initial vs Recurrent Glioma Surgeries (Yearly and Cumulative), BTCDB Overall, 2015-2023" subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
