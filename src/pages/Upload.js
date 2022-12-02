import { useState,useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import MUIRefreshButton from '../common/MUIRefreshButton';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';



import axios from "axios";

// material
import { Container, 
         InputLabel,
         MenuItem,
         FormControl,
         FormHelperText,
         Button,
         Paper,
         Box,
         Select,
         LinearProgress,
         Stack, 
         Typography } from '@mui/material';

// components
import Page from '../components/Page';
import {useAuth} from '../hooks/authContext.js';
import {LoadingButton} from '@mui/lab';
import {CSVArray2JSON} from '../helper/csv2json_helper';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import {CFB, SSF, parse_xlscfb, parse_zip, read, readFile, readFileSync, set_cptable, set_fs, stream, utils, version, write, writeFile, writeFileAsync, writeFileSync, writeFileXLSX, writeXLSX} from 'xlsx';

const EXTENSIONS = ['csv']
const steps = ['Select Template', 'Upload CSV', 'Verify,correct and upload data',"Upload complete"];


export default function Upload() {
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
	  const [gridColumns, setGridColumns] = useState([]); 
	  const [headerObj, setHeaderObj] = useState([]); 
	  const [options, setOptions] = useState({});
	  const [labelProps, setLabelProps] = useState({});
	  
	  
	  const [activeStep, setActiveStep] = useState(0);
	  	  
	  const getExention = (file) => {
		    const parts = file.name.split('.')
		    const extension = parts[parts.length - 1]
		    return EXTENSIONS.includes(extension) // return boolean
		  }
	  
	  const csv2Json = async (data,headerObj) => {
          const queryData = await CSVArray2JSON(data,headerObj); 
          setData(queryData);
          setLoading(false);
        }
	  

	  const importExcel = (e) => {
		
		setLoading(true);
	    const file = e.target.files[0]

	    const reader = new FileReader()
	    reader.onload = (event) => {
	      //parse data

	      const bstr = event.target.result
	      const workBook = read(bstr, { type: "binary" })

	      //get first sheet
	      const workSheetName = workBook.SheetNames[0]
	      const workSheet = workBook.Sheets[workSheetName]
	      //convert to array
	      const fileData = utils.sheet_to_json(workSheet, { header: 1 })
	      
	      // console.log(fileData)
	      //const headers = fileData[0]
	      //const heads = headers.map(head => ({ title: head, field: head }))
	      //setColumns(heads)

	      //removing header
	      //fileData.splice(0, 1)
	      csv2Json(fileData,headerObj);
	     
	    }

	    if (file) {
	      if (getExention(file)) {
	        reader.readAsBinaryString(file)
	      }
	      else {
	        alert("Invalid file input, Select Excel, CSV file")
	      }
	    } else {
	      setData([])
	      //setColumns([])
	    }
	    
	    
	  }
	    
	 const navigate = useNavigate();        
	    
	  useEffect(() => {
	        const fetchData = async () => {
	           const response = await axios.get("https://btcdb-test.ucsf.edu/api/import/template/list/basics", 
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
	           const response = await axios.get("https://btcdb-test.ucsf.edu/api/import/template/"+selTemplateInfo.id, 
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
	           setGridColumns(getGridColumns(response.data));
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
			
			options.download=false;
			options.expandableRows=false;
			options.viewColumns=false;
		       
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
	    
		const getGridColumns = (selTemplateInfo) => {
			var columns = [];
			var options = {};
			var metaHeader =[];
			
			if(selTemplateInfo) {
				 selTemplateInfo.spreadSheetVariables.map( column => {
	        		 columns.push({
	        			  field:column.id.replace('.','_'),
	        			  headerName:column.csvLabel,
				    	  editable:true
				     	}) ;
	        		 metaHeader[column.csvLabel] = column.id.replace('.','_');
					
				});
				
			 } else {
		    	 columns.push({
		    		  field:'',
       			      headerName:'',
			    	  editable:true
			    	}) ;
		     } 
			
			if(isNonPHI) {
				options.filter=false;
				options.searchable=false;
				columns = columns.filter(el=>!el.phi);
			}

	        var mrnColumn = columns.filter(el=>el.name==='Patient_mrn')[0];
			
	        if(mrnColumn) {
				mrnColumn.options = options;
			}
	        
	        setHeaderObj(metaHeader);
	       
	        return columns;
		};
	    
	    const getColumns = (selTemplateInfo) => {
			var columns = [];
			var options = {};
			var metaHeader =[];
			
			if(selTemplateInfo) {
				 selTemplateInfo.spreadSheetVariables.map( column => {
	        		 columns.push({
				    	  name:column.id.replace('.','_'),
				    	  label:column.csvLabel,
				    	  text: column.csvLabel,
				    	  download:true,
				    	  phi:column.phi,
				     	}) ;
	        		 metaHeader[column.csvLabel] = column.id.replace('.','_');
					
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
			
			if(isNonPHI) {
				options.filter=false;
				options.searchable=false;
				columns = columns.filter(el=>!el.phi);
			}

	        var mrnColumn = columns.filter(el=>el.name==='Patient_mrn')[0];
			
	        if(mrnColumn) {
				mrnColumn.options = options;
			}
	        
	        setHeaderObj(metaHeader);
	       
	        return columns;
		};
	    
	    
	    const isNonPHI=()=>{
			return (loginContext 
					&& loginContext.selRole == "NON_PHI" );
		};
		
		
		const generateRandom = () => {
		    var length = 8,
		        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		        retVal = "";
		    for (var i = 0, n = charset.length; i < length; ++i) {
		        retVal += charset.charAt(Math.floor(Math.random() * n));
		    }
		    return retVal;
		};
		
		
		const handleNext = () => {
		    let newActiveStep =
		      isLastStep() && !allStepsCompleted()
		        ? // It's the last step, but not all steps have been completed,
		          // find the first step that has been completed
		          steps.findIndex((step, i) => !false)
		        : activeStep + 1;
		    
		   if(newActiveStep == 1 && !templateId) {
			   newActiveStep = 0; 
			   setLabelProps({error:true});
			   
		   } else {
			   setLabelProps({});
		   }       
		          
		    setActiveStep(newActiveStep);
		  };

		  const handleBack = () => {
		    setActiveStep((prevActiveStep) => prevActiveStep - 1);
		  };
		  
		  
		 
			  const handleReset = () => {
			    setActiveStep(0);
			  };
		  
		  const totalSteps = () => {
			    return steps.length;
			  };

			  const completedSteps = () => {
			    return 1;
			  };

			  const isLastStep = () => {
			    return activeStep === totalSteps() - 1;
			  };

			  const allStepsCompleted = () => {
			    return completedSteps() === totalSteps();
			  };

	  return (
	    <Page title="Upload">
	     <Container maxWidth="xl">
	        <Box sx={{ pb: 5 }}>
	        <Stack direction="row" alignItems="center" spacing={0.5}>    
	          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
	          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
	            <ResetTvIcon color="success" fontSize="inherit" />
	          </IconButton>    
	        </Stack>
	        </Box>
	     
	        <Stack > 
		        <Stepper activeStep={activeStep}>
		        {steps.map((label, index) => {
		          const stepProps: { completed?: boolean } = {};
		          
		          return (
		            <Step key={label} {...stepProps}>
		              {activeStep==index && 
		                <StepLabel {...labelProps} >{label}</StepLabel> 
		              } 
		              {activeStep!=index && 
			                <StepLabel>{label}</StepLabel> 
			          }
		            </Step>
		          );
		        })}
		      </Stepper>
	       </Stack>   
	       
	       <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={12}>  
	           <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
	           {activeStep ==0 && 
	        	   
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
	           }
	          
	           {activeStep ==1 &&
	                  <input
		                  type="file"
		                  onChange={importExcel}	  
		                />
	           }
	         
	         </Typography>
	         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
	           <Button
	             color="inherit"
	             disabled={activeStep === 0}
	             onClick={handleBack}
	             sx={{ mr: 1 }}
	           >
	             Back
	           </Button>
	           <Box sx={{ flex: '1 1 auto' }} />
	           <Button   disabled={activeStep === 2}  onClick={handleNext} sx={{ mr: 1 }}>
	           		Next
	           </Button>
	         </Box>
          </Stack>
	      <Stack>
	            { templateInfo && 
	            <MUIDataTable
	                title={templateInfo.name}
	                options={options}
	                data={(activeStep == 2 ?data:[])}
	                columns={columns} 
	                />
	            }
	            {loading && activeStep == 2 && <LinearProgress />}    
	        </Stack>    
	      </Container>            
	    </Page>
	  );
}
