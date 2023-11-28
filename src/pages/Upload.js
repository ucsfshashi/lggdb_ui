import { useState,useEffect } from 'react';
import MUIRefreshButton from '../common/MUIRefreshButton';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ConfirmDialog from '../components/ConfirmDialog'
import UploadView from '../components/UploadView'
import PatientCardView from '../components/PatientCardView';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';



import axios from "axios";

// material
import { Container, 
         InputLabel,
         MenuItem,
         FormControl,
         FormHelperText,
         Button,
         Paper,
         Alert,
         AlertTitle,
         Box,
         Select,
         LinearProgress,
         CircularProgress,
         Stack, 
         Typography } from '@mui/material';

// components
import Page from '../components/Page';
import {useAuth} from '../hooks/authContext.js';
import {LoadingButton} from '@mui/lab';
import {CSVArray2JSON} from '../helper/csv2json_helper';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ResetTvIcon from '@mui/icons-material/ResetTv';
import {CFB, SSF,  read, readFile, stream, utils, version} from 'xlsx';

const EXTENSIONS = ['csv']
const steps = ['Select Template', 'Upload CSV', 'Verify,correct and upload data',"Uploading..."];

export default function Upload() {
	
	  const {loginContext} = useAuth();
	  const [templates, setTemplates] = useState(null);    
	  const [error, setError] = useState(null);    
	  const [templateId, setTemplateId] = useState(null);   
	  const [templateInfo, setTemplateInfo] = useState(null);   
	  const [disabled, setDisabled] = useState(true);       
	  const [loading, setLoading] = useState(false);   
	  const [confirmOpen,setConfirmOpen] = useState(false);   
	  const [editMode,setEditMode] = useState(false);   
	  const [rowId, setRowId] = useState(-1);   
	  const [data, setData] = useState([]);    
	  const [columns, setColumns] = useState([]); 
	  const [headerObj, setHeaderObj] = useState([]);
	  const [typesObj, setTypesObj] = useState([]);
	  const [idsObj, setIdsObj] = useState([]);
	  const [failedData, setFailedData] = useState([]); 
	  const [uploadProgress, setUploadProgress] = useState(false);
	  const [labelProps, setLabelProps] = useState({});
	  const [activeStep, setActiveStep] = useState(0);

	  
	  const getExention = (file) => {
		    const parts = file.name.split('.')
		    const extension = parts[parts.length - 1]
		    return EXTENSIONS.includes(extension) // return boolean
		  }
	  
	  const csv2Json = async (data,headerObj) => {
          const queryData = await CSVArray2JSON(data,headerObj,typesObj); 
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
	      const fileData = utils.sheet_to_json(workSheet, { header: 1,raw:true })
	      
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
	    }
	    
	    
	  }
	    
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
	                      setError("Failed to fetch template list");
	            });    
	            
	            setTemplates(response.data);
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
	  
	  const handleEdit = (event,value, tableMeta, updateValue) => {
		  setRowId(value);
		  setEditMode(true);
	  };
	  
	  
	  const handleDelete = (event,value, tableMeta, updateValue) => {
		  setRowId(value);
	      setConfirmOpen(true);
	  };  
	  
	  const deletePost = (event: SelectChangeEvent) => {
		  if (rowId > -1) { // only splice array when item is found
			  data.splice(rowId, 1); // 2nd parameter means remove one item only
			  setData([]);
			  setData(data);
			  setRowId(-1);
		  }
	  };  
	  
	  const setOpen=() => {
		  setConfirmOpen(!confirmOpen);
	  }

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
	                      setError("fail to fetch template info");
	            });    
	            
	           setTemplateInfo(response.data);
	           loadColumns(response.data);
	      };
	      fetchData();
	 }  
	  
	  const uploadData = () => {
	      const uploadInBatch = async () => {
	    	  let index =0;
	    	  let failedData=[];
	    	   do{
	    		  const headers = { 
	   	    		   'Content-Type' :'application/json',
	   	               'X-Requested-With':'XMLHttpRequest', 
	   	               'UCSFAUTH-TOKEN':loginContext.token,
	   	               'tagId':loginContext.selTag.tagId,
	   	               'selRole':loginContext.selRole,
	   	               'templateId':templateInfo.id,
	   	          	};
	    		    var response = await axios.post(loginContext.apiUrl+"/import/data", JSON.stringify(data.slice(0,5)), { headers });
	    		   
	    		   	if(response && response.status == 200) {
	    		   		data.splice(0,5);
	    		   	    setData([]);
			  			setData(data);
			  			setRowId(-1);
			  			
			  			if(response.data && response.data.failedRecords && response.data.failedRecords.length >0) {
			  				for(var i in response.data.failedRecords) {
			  					failedData.push(response.data.failedRecords[i]);
			  				}
			  			}
			  	   	} 
	    	  }while(data.length>0)
	    	  setUploadProgress(false);
	    	  
	    	  if(failedData.length >0) {
	    	    setActiveStep(2);
	    	    setData(failedData);
	    	    setFailedData(failedData);
	    	  } else {
	    	    setActiveStep(4);
	    	  }
	      };
	      uploadInBatch();
	 }   
	  
	const getSelData =(selIndex) => {
		let selData =  Object.assign({}, data[selIndex]);
 		return selData;
	}
	
	const getData =() =>{
		
		if(activeStep >= 2) {
			return data
		}
		
		return [];
	}

	const getOptions =() =>{
			var options ={};
			
	
			if(activeStep === 0) {
			     options = {
				    textLabels: {
				      body: {
				        noMatch: 'Click on next to upload csv file',
				      }
				    }
				  };
				 
				 options.filter=false;
				options.search=false;
				options.download=(data.length == 0); 
				  
			}
			else if(activeStep === 1) {
			     options = {
				    textLabels: {
				      body: {
				        noMatch: 'Upload CSV and click on next to validate and change data',
				      }
				    }
				  };
				  
				  options.filter=false;
				options.search=false;
				options.download=(data.length == 0);
			}
			else if(activeStep === 2) {
				options.filter=true;
				options.search=true;
				options.download=(failedData.length > 0);
				options.responsive='scroll';
				
			} else if(activeStep === 3 || activeStep === 4) {
			
			     options = {
				    textLabels: {
				      body: {
				        noMatch: 'All rows are uploaded successfully',
				      }
				    }
				  };
			
				options.filter=false;
				options.search=false;
				options.download=false;
				options.responsive='vertical';
				options.download=false;
				
			}
		    else {
				options.filter=false;
				options.search=false;
				options.download=(data.length == 0);
				options.responsive='vertical';
			}
			
			
			
			
			
			options.fixedHeader = true;
			options.print =false;
			options.pagination = false;
			options.fixedHeader=true;


			options.selectableRows = 'none';
			options.filterType='multiselect';
			
			
			options.expandableRows=false;
			options.viewColumns=false;
			
			options.onTableChange = (action, state) => {
			      console.log(action);
			      console.dir(state);
			    }
		       
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
		
		const loadColumns = (selTemplateInfo) => {
	
			var metaHeader =[];
			var metaIds=[];
			var typesObj=[];
			
			if(selTemplateInfo) {
				 selTemplateInfo.spreadSheetVariables.map( column => {
	        		 metaHeader[column.csvLabel] = column.columnName;
	        		 typesObj[column.columnName]=column.type;
	        		 metaIds.push(column.columnName);
					
				});
			 } 
			setIdsObj(metaIds)
	        setHeaderObj(metaHeader);
			setTypesObj(typesObj);
		};
		
		const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 1000,
    fontSize: theme.typography.pxToRem(12),
  },
}));
	    
		const getColumns = (selTemplateInfo) => {
			var columns = [];
			var options = {};
			
			
			if(selTemplateInfo) {
				
				columns.push({
			    	  name: 'rowAction',
			    	  label:' ',
			    	  text: ' ',
			    	  download:false,
			    });
				
				
				if(activeStep === 2) {
					
					var optionsEdit = {};
					optionsEdit.customBodyRenderLite = (value, tableMeta, updateValue) => {
						return (
							<Stack direction="row" alignItems="baseline">
							<Button onClick={(event)=>handleEdit(event,value, tableMeta, updateValue)} >
			            		<EditIcon ontSize='small' />
			            	</Button>
			            	<Button onClick={(event)=>handleDelete(event,value, tableMeta, updateValue)} >
			            		<DeleteIcon ontSize='small' />
			            	</Button>
			            	
			            	{failedData && failedData.length >0 &&
			            	
			            	
							<HtmlTooltip
					        title={
					            <Alert severity="error">
  									<AlertTitle>Error</AlertTitle>
  									{failedData[value].errorMsg}
								</Alert>
					        }
					      >
					   		<Button color="error" onClick={(event)=>handleDelete(event,value, tableMeta, updateValue)} >
			            		<ErrorIcon ontSize='small' />
			            	</Button>
					   
					      </HtmlTooltip>
			             }
			            	
			            	
			            	
			            	
			            	
			            	
			            	</Stack>	
			           );
					};
					
					
					columns[0].options = optionsEdit;
				}else if(activeStep === 3) {
					var optionsEdit = {};
					optionsEdit.customBodyRenderLite = (value, tableMeta, updateValue) => {
						return (
							<Stack direction="row" alignItems="baseline">
								 <CircularProgress color="inherit" size={15} />
							</Stack>	
			           );
					};
					columns[0].options = optionsEdit;
				} else if(activeStep === 4) {
				       columns[0].name='errorMsg';
				       columns[0].label='errorMsg';
				       columns[0].text='errorMsg';
				       
				}else {
					columns[0].options = {};
				}
				
				
				 selTemplateInfo.spreadSheetVariables.map( column => {
	        		 columns.push({
				    	  name:column.columnName,
				    	  label:column.csvLabel,
				    	  text: column.csvLabel,
				    	  download:true,
				    	  options: {
				    	     sort:false,
				    	  },
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
			
			if(isNonPHI) {
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
	    
	    
	    const isNonPHI=()=>{
			return (loginContext 
					&& loginContext.selRole == "NON_PHI" );
		};
		
		
		const handleNext = () => {
		    let newActiveStep =
		      isLastStep() && !allStepsCompleted()
		        ? // It's the last step, but not all steps have been completed,
		          // find the first step that has been completed
		          steps.findIndex((step, i) => !false)
		        : activeStep + 1;
		    
		   if(newActiveStep == 1 && templateId == null) {
			   newActiveStep = 0; 
			   
			   setLabelProps({error:true,optional:(
			              <Typography variant="caption" color="error">
			                Please select template
			              </Typography>
			            )});
		   } else if(newActiveStep == 2 && data && data.length == 0) {
			   newActiveStep = 1; 
			   setLabelProps({error:true,optional:(
			              <Typography variant="caption" color="error">
			                Please upload valid CSV file
			              </Typography>
			            )});
			   
		   } else {
			   setLabelProps({});
		   }
		   
		   if(newActiveStep === 3) {
			   setUploadProgress(true);
			   uploadData();
		   }
		   
		   setActiveStep(newActiveStep);
		  };

		  const handleBack = () => {
		    setActiveStep((prevActiveStep) => prevActiveStep - 1);
		    setEditMode(false);
		  };
		  
		  const onCancel = () => {
			    setEditMode(false);
		  };
		  
		  const onSave = (datum) => {
			 data[rowId]=datum;
			 setEditMode(false);
		  };
		  
		  const handleReset = () => {
			    setActiveStep(0);
		   };
		  
		     const totalSteps = () => {
			    return steps.length;
			  };

			  const completedSteps = () => {
			    return activeStep;
			  };

			  const isLastStep = () => {
			    return activeStep === totalSteps() - 1;
			  };

			  const allStepsCompleted = () => {
			    return completedSteps() === totalSteps();
			  };
			  
			  const getRows  = () => {
				  return loginContext.schema.filter(el => idsObj.indexOf(el.id) > -1);
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
		            <Step key={label} {...stepProps}  >
		              {activeStep==index && 
		                <StepLabel {...labelProps} >{label}</StepLabel> 
		              } 
		              {activeStep!=index && index < 3 &&
			                <StepLabel>{label}</StepLabel> 
			          }
			           {activeStep!=index && index === 3 && activeStep !=4 &&
			                <StepLabel>{label}</StepLabel> 
			          }
			          {activeStep!=index && activeStep ===4 && index ===3 &&
			                <StepLabel>Upload Complete</StepLabel> 
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
	         { activeStep < 3 && 
	         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
	          
	          { !(failedData && failedData.length >0) &&
	          <Button
	             color="inherit"
	             disabled={activeStep === 0}
	             onClick={handleBack}
	             sx={{ mr: 1 }}
	           >
	             Back
	           </Button> }
	          
	           <Box sx={{ flex: '1 1 auto' }} />
          	   <Button   disabled={activeStep === 3}  onClick={handleNext} sx={{ mr: 1 }}>
          		 Next
          	   </Button>
	         </Box>
	         }
	         	
          </Stack>
	      <Stack>
	            { templateInfo && editMode == false && 
	            <UploadView
	                title={templateInfo.name}
	                options={getOptions()}
	                data={getData()}
	                columns={getColumns(templateInfo)} 
	                />
	            }
	            { activeStep == 2 && editMode == true && 
	            	
	            	<PatientCardView
	            	rows={getRows()}
	                cardTitle={templateInfo.name}
	                isNewPatient={true}
	                saveClick={(datum)=>onSave(datum)}
	                cancelClick={()=>onCancel()}
	                loginContext={loginContext}
				    patientInfo={getSelData(rowId)}
				   />
	            
	            }
	            {loading && activeStep == 2 && <LinearProgress />} 
	            <ConfirmDialog
        	    title="Delete Record "
        	    open={confirmOpen}
        	    setOpen={setOpen}
        	    onConfirm={deletePost}
        	    >
	            Do you want to delete selected row ?
        	  </ConfirmDialog>	
	        </Stack>    
	      </Container>            
	    </Page>
	  );
}
