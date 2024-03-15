import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';

import axios from "axios";
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';



// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------


export default function DemographicCount(input) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [xyz, setXyz] = useState(0);
  const [summary, setSummary] = useState([]);
  const [chartOptions, setChartOptions] = useState(merge(BaseOptionChart(), {
	    
	    colors: [
	      theme.palette.primary.main,
	      theme.palette.info.main,
	      theme.palette.warning.main,
	      theme.palette.error.main
	    ],
	    labels:[],
	    stroke: { colors: [theme.palette.background.paper] },
	    legend: { floating: true, horizontalAlign: 'center' },
	    dataLabels: { enabled: true, dropShadow: { enabled: false } },
	    tooltip: {
	      fillSeriesColor: false,
	      y: {
	        formatter: (seriesName) => fNumber(seriesName),
	        title: {
	          formatter: (seriesName) => `#${seriesName}`
	        }
	      }
	    },
	    plotOptions: {
	      pie: { donut: { labels: { show: false } } }
	    }
	  }));

  const extractData = async() => {
	  
	  if(xyz<2) {
	      setLoading(true);
	      var path ='/patients/race/summary';
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
	      }
	      setLoading(false);
	      setSummary(summaryInfo);
	      var lChartOptions  = chartOptions; 
	      lChartOptions.labels=summaryInfo.map(a => a.label);
	      setChartOptions(lChartOptions);
	      setXyz(xyz+1);
	  }
 };
  
 useEffect(() => {
	 extractData();
  }, [xyz]);

  return (
    <Card>
      <CardHeader title={"Distribution of Race/Ethnicity ,["+ input.loginContext.selTag.tagName +"]"} />
    	  <ChartWrapperStyle dir="ltr">
	      {
	        loading == true &&  <CircularProgress disableShrink sx={{marginTop:'150px',marginLeft:'150px'}}/>
	      }
	      {
	    	loading  === false && 
		    <ReactApexChart type="pie" series={summary.map(a => a.count)} options={chartOptions} height={280} />
		  }
	      </ChartWrapperStyle>
    </Card>
  );
}