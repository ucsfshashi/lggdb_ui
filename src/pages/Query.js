import { useState,useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import MUIRefreshButton from '../common/MUIRefreshButton';

import axios from "axios";

// material
import { Container, 
         InputLabel,
         MenuItem,
         FormControl,
         FormHelperText,
         Box,
         Select,
         LinearProgress,
         Stack, 
         Typography } from '@mui/material';

// components
import Page from '../components/Page';
import {useAuth} from '../hooks/authContext.js';
import {LoadingButton} from '@mui/lab';
import {CSV2JSON} from '../helper/csv2json_helper';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';


// ----------------------------------------------------------------------
export default function Query() {
  const [openFilter, setOpenFilter] = useState(false);
  const {loginContext} = useAuth();
  const [templates, setTemplates] = useState(null);    
  const [error, setError] = useState(null);    
  const [templateId, setTemplateId] = useState(null);   
  const [templateInfo, setTemplateInfo] = useState(null);   
  const [disabled, setDisabled] = useState(true);       
  const [loading, setLoading] = useState(false);    
  
  const [data, setData] = useState([]);    
  const [columns, setColumns] = useState([]); 
  const [options, setOptions] = useState({});    
    
 const navigate = useNavigate();        
    
  useEffect(() => {
        const fetchData = async () => {
           const response = await axios.get(loginContext.apiUrl+"/import/template/list/basics", 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId    
                                    }}
                                    ).catch((err) => {
               if(err && err.response)
                  if(err.response.status != 200) 
                      setError("User name or Password is invalid");
            });    
            
            setTemplates(response.data);
            setOptions(getOptions());
        };
        fetchData();
        }, []);    
    
  const handleChange = (event: SelectChangeEvent) => {
         setTemplateId(event.target.value);
         setTemplateInfo(null); 
         setData([]); 
         fetchTemplateInfo(templates[event.target.value]);
         setDisabled(false);
  };  

  const fetchTemplateInfo = (selTemplateInfo) => {
      const fetchData = async () => {
           const response = await axios.get(loginContext.apiUrl+"/import/template/"+selTemplateInfo.id, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId    
                                    }}
                                    ).catch((err) => {
               if(err && err.response)
                  if(err.response.status != 200) 
                      setError("User name or Password is invalid");
            });    
            
           setTemplateInfo(response.data);
           setOptions(getOptions());
           setColumns(getColumns(response.data));
    
        };
      fetchData();
 }    
    
const getOptions =() =>{
		var options = {};
		
		options.fixedHeader = true;
		options.print =false;
		options.pagination = false;
		options.responsive='scroll';
		options.selectableRows = 'none';
		options.filterType='multiselect';
		
		options.download=true;
	    options.downloadOptions={};
		
	
		if(templateInfo) {
			options.downloadOptions.filename= templateInfo.name+formateNow()+'.csv';
		} else {
			options.downloadOptions.filename= 'download_'+formateNow()+'.csv';
		}
        
       
		options.downloadOptions.separator= ',';
		//options.onTableChange=this.onTabStateChange;
		
        /*
		options.customToolbar= () => {
	        return (
	         <MUIRefreshButton onDownloadClick={(e)=>this.downloadCsv(e)}   onRefreshClick={(e) => this.extractData(e,this.state.templateId)} />
	        );
	      };
          */
       
    	return options;
	};    

    
   const formateNow = () => {
	
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_min = d.getMinutes();
		var curr_sec = d.getSeconds();
		
		var dateString = '_'+curr_year+'_'+curr_month+'_'+curr_date+'_'+curr_hour+'_'+curr_min+'_'+curr_sec;
		
		return dateString;
	};
    
    
    const getColumns = (selTemplateInfo) => {
		var columns = [];
		var options = {};
		
		if(selTemplateInfo) {
			 selTemplateInfo.spreadSheetVariables.map( column => {
        		 columns.push({
			    	  name:column.id.replace('.','_'),
			    	  label:column.csvLabel,
			    	  text: column.csvLabel,
			    	  download:true,
			    	  phi:column.phi,
			     	}) ;
				
			});
			
		 } else {
	    	 columns.push({
		    	  name: '',
		    	  label:' ',
		    	  text:' ',
		    	  download:false,
		    	  phi:false,
		    	}) ;
	     } 
		
		if(loginContext 
		  && loginContext.selRole == "NON_PHI") {
			options.filter=false;
			options.searchable=false;
			columns = columns.filter(el=>!el.phi);
		}

        var mrnColumn = columns.filter(el=>el.name==='Patient_mrn')[0];
		
        if(mrnColumn) {
			mrnColumn.options = options;
		}
        
    	return columns;
	};
    
    const queryData=()=>{
		setLoading(true);
      
        const fetchData = async () => {
           const response = await axios.get(loginContext.apiUrl+"/query/v1/"+templateInfo.id, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                       'selRole':loginContext.selRole,
                                       'Accept': 'text/csv'
                                    }}
                                    ).catch((err) => {
               if(err && err.response)
                  if(err.response.status != 200) 
                      setError("Unable to fetch template data");
            });
            
            const csv2Json = async () => {
              const queryData = await CSV2JSON(response.data); 
              setData(queryData);
              setLoading(false);
            }
            
            if(response && response.data) {
                csv2Json();
            }
        };
      fetchData();
      
	};
    
    
  return (
    <Page title="Query">
     <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
            <ResetTvIcon color="success" fontSize="inherit" />
          </IconButton>    
        </Stack>
        </Box>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={12}>    

                  <FormControl sx={{ m: 1, minWidth: 120 }} >
                  <InputLabel id="demo-select-small">Select Template</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={templateId}
                    label="Select Role"
                    onChange={handleChange}
                  >
                  {templates && templates.map(function(rec, index){
                    return <MenuItem value={index}>{rec.name}</MenuItem>;
                  })}
                </Select>
                <FormHelperText><strong>{templateInfo && templateInfo.description}</strong></FormHelperText>
                </FormControl>

                <LoadingButton
                    size="large"
                    type="submit"
                    onClick={queryData}    
                    variant="contained"
                    loading={loading}
                    disabled={disabled}    
                    >
                        Query
                  </LoadingButton>
            </Stack>
            <Stack>
            { templateInfo && 
            <MUIDataTable
                title={templateInfo.name}
                options={options}
                data={data}
                columns={columns} 
                />
            }
            {loading && <LinearProgress />}    
            </Stack>    
      </Container>            
    </Page>
  );
}
