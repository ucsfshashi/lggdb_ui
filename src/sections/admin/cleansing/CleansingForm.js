import { useState,useEffect,useMemo } from 'react';
import axios from "axios";
import * as React from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';
import { useNavigate } from 'react-router-dom';
import SetChooser from './SetChooser.js'
import CleansingSaveForm from './CleansingSaveForm.js';


// material
import {
  Stack,
  Paper,
  Box,
  IconButton,
  Typography,
  LinearProgress
 } from '@mui/material';
import Page from '../../../components/Page';
import {useAuth} from '../../../hooks/authContext.js';
import ResetTvIcon from '@mui/icons-material/ResetTv';

import { lab } from 'd3-color';


export default function CleansingForm() {
  const navigate = useNavigate();
  const {loginContext} = useAuth();
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);    
  const [data, setData] = useState([]);    
  const [selSet, setSelSet] = useState([]);  
  const [refresh, setRefresh] = useState(false);
  const [edited, setEdited] = useState(false);
  
  const [selMode, setSelMode] = useState(false);   

  const [selection, setSelection] = React.useState([]);
  const [checked, setChecked] = React.useState([]);
  const [tagList, setTagList] = useState(null);   
  const colors	=  ['#800000', '#9A6324', '#808000', '#469990', '#000075', '#e6194B', '#f58231', '#ffe119',
                    '#bfef45', '#3cb44b','#4363d8','#911eb4','#911eb4','#f032e6','#a9a9a9','#ffd8b1','#ffd8b1'
                  ]	
  

    useEffect(() => {
      const fetchData = async () => {
		
		  /*var lData = localStorage.getItem("upset_data");
		  
		  if(lData == null)  {*/
			
			  setLoading(true);
		
	    	  var url = loginContext.apiUrl+"/studyTag/summary";
	    	
			    const response = await axios.get(url, 
	                                  {headers:{
	                                    'Content-Type' :'applicaiton/json',
	                                    'X-Requested-With':'XMLHttpRequest', 
	                                    'UCSFAUTH-TOKEN':loginContext.token,
	                                    'selRole':loginContext.selRole,
	                                  }}
	                                  ).catch((err) => {
	             if(err && err.response)
	                if(err.response.status != 200) 
	                    setError("Unable to load studies");
	          });
	    	  
	    	  if(response && response.data) {
				  //localStorage.setItem("upset_data", JSON.stringify(response.data));
	              setData(response.data);
				  tagSummary(response.data);
				  setLoading(false);
		       }
		   
		  /* } else {
			setData(JSON.parse(lData));
			tagSummary(JSON.parse(lData));
		   }*/
         
      };
      fetchData();
      }, [refresh]);
	  
	  const tagSummary =(lData) => {
	  	  
			  var lSummary=null;
			  	
	  	      if(lData.tagList) {
				lSummary=lData.tagList.sort((a, b) => b.noOfPatients - a.noOfPatients);
				setTagList(lSummary);
	  	    	
	  	      }

			  if(checked && checked.length ==0) {
		  	      for(var i  in lSummary) {
					if(i<5) {
		  	       		checked.push(lSummary[i].tagName);
			   		}
		  	      }
				  setChecked(checked);
			  }
	  }
	  
	  const elems = useMemo(
	  		  	   () => ((data && data.upsertInfo) ? data.upsertInfo:[]),
	  		  	   [data]
	  		  	  );
	  const { sets } = useMemo(() => extractCombinations(elems), [elems]);
	  
	  
	  const handleToggle = (newChecked)  => {
	  		setChecked(newChecked);
	  };
		
	  
	  const handleHover = (newSelection) => {
	      setSelection(newSelection);
	    };
		
	  const filterSets = (lSets) => {
		
		var pSets = [];
		var index =0;
		
		if(lSets && lSets.length > 0) {
			pSets=lSets.filter((el) => checked.includes(el.name));
			pSets.map((el) => el['color']=colors[index++]);
		   
		}
		
		
		
		return pSets;
	  }	
	  
	  const returnMainPage = () => {
		   
		   setSelMode(false);
		   
		   if(edited == true) {
			 setRefresh(!refresh);
			 setEdited(false);
		   } 
		   
		  
	  };
	  
	  const markEdited =() => {
		setEdited(true);
	  };
	  
	  
	  const onClickHandler = (set) => {
	      if (set) {
	        setSelSet(set);
			setSelMode(true);
	        // Perform actions based on the clicked set
	      } else {
			setSelMode(false);
	        console.log('Clicked on background');
	        // Perform actions when no set is clicked
	      }
	    };

	  const mergeColors=(colors) => {
	    if (colors.length === 0) {
	      return undefined;
	    }
	    if (colors.length === 1) {
	      return colors[0];
	    }
	    const cc = colors.reduce(
	      (acc, d) => {
	        const c = lab(d || 'transparent');
	        return {
	          l: acc.l + c.l,
	          a: acc.a + c.a,
	          b: acc.b + c.b,
	        };
	      },
	      { l: 0, a: 0, b: 0 }
	    );
	    return lab(cc.l / colors.length, cc.a / colors.length, cc.b / colors.length).toString();
	    
	  }

	  
  return (
		 <Page title="Study Overlap">
		  { selMode == false  &&
			  <Stack > 
			  	<Box sx={{ pb: 5 }}>
		        <Stack direction="row" alignItems="center" spacing={0.5}>    
		          <Typography variant="h4">Study Overlap</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
	          	
			  	
			  <Paper elevation={3} >
			  <Stack  direction="row" spacing={3} >   
			  { loading ===false &&  sets && sets.length >0 && 
			   
			  <UpSetJS
			     sets={filterSets(sets)}
				 onClick={onClickHandler}
			     width={780}
			     height={700}
				 setMaxScale={100}
		         combinationMaxScale={100}
				 onHover={handleHover} 
			     combinationName="Number of Patients"
				 combinations={{
				         mergeColors,
				       }}
			   /> }
			   
			   { loading === true && 
			   			   
				<Box sx={{ width: '100%' }}>
				     <LinearProgress />
				   </Box>
			    }
				
				<Box>
					  <SetChooser tagInfo={tagList} handleCheck={(checked)=>handleToggle(checked)} checkedItems={checked} />
				</Box>
				
				</Stack>
			  </Paper>
			  
	  	    </Stack>	
	  	 }
		 { selMode == true  &&
			
			<Stack > 
			  	<Box sx={{ pb: 5 }}>
		        <Stack direction="row" alignItems="center" spacing={0.5}>    
		          <Typography variant="h4">Study Overlap</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => returnMainPage()}>
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
				<CleansingSaveForm selSet={selSet}  tagInfo={tagList} markEdited={markEdited} />
		    </Stack>		
			
		 }
	  
		 </Page>
  );
}
