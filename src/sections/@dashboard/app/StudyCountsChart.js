import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';
import React, { useEffect, useState } from 'react';
import axios from "axios";



// ----------------------------------------------------------------------
export default function StudyCountsChart(input) {

  const [xyz, setXyz] = useState(0);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState([{ data: [] }]);
  const [chartOptions, setChartOptions] = useState(merge(BaseOptionChart(), {
	      tooltip: {
	        marker: { show: false },
	        y: {
	          formatter: (seriesName) => fNumber(seriesName),
	          title: {
	            formatter: (seriesName) => `#${seriesName}`
	          }
	        }
	      },
	      plotOptions: {
	        bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
	      },
	      xaxis: {
	        categories: [
	        ]
	      }
	    }));
  
  
  
const extractData = async() => {
	  
	  if(xyz<2) {
	      setLoading(true);
	      var path ='/studyTag/list';
	      var summaryInfo = await axios.get("https://btcdb-test.ucsf.edu/api"+path, 
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
		      summaryInfo =summaryInfo.sort((a, b) => b.noOfPatients - a.noOfPatients);
	      }

	      setLoading(false);
	     // setSummary(summaryInfo);
	      var lChartOptions  = chartOptions; 
	      var lSummary = summary;
	      var labels = [];
	      var lDatas =[];
	      
	      for(var i  in summaryInfo) {
	    	  if(i <= 7) {
		    	  labels.push(summaryInfo[i].tagName);
		    	  lDatas.push(summaryInfo[i].noOfPatients);
	    	  }
	      }
	      
	      lSummary[0].data = lDatas;
	      lChartOptions.xaxis.categories=labels;
	     
	      setSummary(lSummary);
	      setChartOptions(lChartOptions);
	      
	      setXyz(xyz+1);
	  }
 };
  
 useEffect(() => {
	 extractData();
  }, []);

  return (
    <Card>
      <CardHeader title="BTCDB Patient Accrual by Study" subheader="Number of patients uploaded from each study" />
   
      { chartOptions.xaxis.categories && chartOptions.xaxis.categories.length > 0 &&	  
	      <Box sx={{ mx: 3 }} dir="ltr">
	        <ReactApexChart type="bar" series={summary} options={chartOptions} height={364} />
	      </Box>
      }
      
    </Card>
  );
}
