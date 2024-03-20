import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';
import React from 'react';
import axios from "axios";


const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
	  height: CHART_HEIGHT,
	  marginTop: theme.spacing(2),
	  '& .apexcharts-canvas svg': {
	    height: CHART_HEIGHT
	  },
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

export default class DemographicAge extends React.Component {
	
	
    constructor(props) {
      super(props);

      this.state = {
        series: [{
          data: []
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: [],
          }
        },
      
      
      };
    };
    
    
    async extractData () {
        const {loginContext} = this.props;
        
         var path ='/patients/diagnosis/age';
	      var summaryInfo = await axios.get(loginContext.apiUrl+""+path, 
	                                  {headers:{
	                                    'Content-Type' :'applicaiton/json',
	                                    'X-Requested-With':'XMLHttpRequest', 
	                                    'UCSFAUTH-TOKEN':loginContext.token,
	                                     'tagId':loginContext.selTag.tagId,
	                                     'Accept': 'application/json',
	                                  }}
	                                  );
	      if(summaryInfo) {
	    	  summaryInfo = summaryInfo.data;
	    	  
	    	  var series = this.state.series;
	    	  series[0].data = summaryInfo.map(a => a.count+10);
	    	  
	    	  var options = this.state.options;
	    	  
	    	  options.xaxis.categories = summaryInfo.map(a => a.label);
	    	  
	    	  this.setState({series:series,options:options});
	    	  
	      }
   };
	
	componentDidMount(){
		this.extractData();
	};
    
    
    render() {
      return (
    	<Card>
    	<CardHeader title={"Distribution of Age Group at Diagnosis, "+ this.props.loginContext.selTag.tagName}/>
    		<ChartWrapperStyle dir="ltr">
    	    { this.state.series[0].data && this.state.series[0].data.length >0 && 
    		<ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
    	    }
    	    </ChartWrapperStyle>
    	</Card>
      );
    }
  }

