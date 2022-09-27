import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState,useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import axios from "axios";

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  LinearProgress,    
  Box,    
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
//
import USERLIST from '../_mocks_/user';

import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import {useAuth} from '../hooks/authContext.js';
import {CSV2JSON} from '../helper/csv2json_helper';

function descendingComparator(a, b, orderBy) {

}

export default function User() {
const navigate = useNavigate();
const {loginContext, setLoginContext} = useAuth();
const [data, setData] = useState([]);    
const [error, setError] = useState([]);  
const [loading, setLoading] = useState(true);        

    

 useEffect(() => {
        const fetchData = async () => {
           const response = await axios.get("https://btcdb-test.ucsf.edu/api/patients/list", 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                        'selRole':loginContext.selRole,
                                        'Accept': 'application/json',
                                    }}
                                    ).catch((err) => {
               if(err && err.response)
                  if(err.response.status != 200) 
                      setError("User name or Password is invalid");
            });
           
            if(response && response.data) {
               setData(response.data);
                setLoading(false);
            }
            
         };
    fetchData();
 }, []);
    
const getOptions =() =>{
		var options = {};
		
		options.fixedHeader = true;
		options.print =false;
		options.pagination = false;
		options.responsive='scroll';
		options.selectableRows = 'none';
		options.filterType='multiselect';
        options.download=false;
    	return options;
};

const getColumns = () => {
		var columns = [];
		var options = {}
		
        
        
        options.customBodyRender = (value, tableMeta, updateValue) => {
        
         
        
			if(isNonPHI())  {
				return (
					<Button size="small" color="primary"   onClick={()=>gotoPatient(value)} >
					   {'XXXXXXXXXX'}
			        </Button>
				);
			} else {
				return (
					<Button size="small" color="primary"  onClick={()=>gotoPatient(value)} >
					   {value}
			        </Button>
				);	
			}
		};
            
		
		var rows = loginContext.schema.filter(el => el.className === "Patient");
		
		
		if(isNonPHI()) {
			rows = rows.filter(el => (el.phi === false || el.id=='mrn'));
			options.filter=false;
			options.searchable=false;
		}
		
		rows.forEach(
				function(elem){
					if(elem.type!='link'){
					columns.push({
				    	  name:'Patient.'+elem.id,
				    	  label:elem.displayName,
				    	  text: elem.displayName
				     	});
					} });
		
		columns.filter(el=>el.name==='Patient.mrn')[0].options = options;
		
		return columns;
};    

const gotoPatient=(value)=>{
	setLoginContext({mrn:value});
	setLoginContext({topic:'Demographics'});
	navigate('/goto/patient');
};

const isNonPHI=()=>{
    return (loginContext 
            && loginContext.selRole == "NON_PHI" );
};    

return (
    <Page title="Patients">
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
        <MUIDataTable
            title="Patients"
            options={getOptions()}
            data={data}
            columns={getColumns()} 
            />
        {loading && <LinearProgress />}
        </Stack>
                     
     </Container>
    </Page>
  );
}
