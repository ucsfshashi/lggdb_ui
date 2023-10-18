import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius,dataTypes,overWriteOptions } from './constants';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import {ListItemButton,ListItemIcon,ListItemText,
	ListItem,IconButton,Switch,Alert,
	Stack,Typography,TextField,FormControl,InputLabel,Select,MenuItem,Box,Skeleton,Paper} from '@mui/material';

	
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;

type Props = {|
  task: TaskType,
  index: number,
  isSelected: boolean,
  isGhosting: boolean,
  selectionCount: number,
  toggleSelection: (taskId: Id) => void,
  toggleSelectionInGroup: (taskId: Id) => void,
  multiSelectTo: (taskId: Id) => void,
|}

type GetBackgroundColorArgs= {|
  isSelected: boolean,
  isDragging: boolean,
  isGhosting: boolean,
|}

const getBackgroundColor = ({
  isSelected,
  isGhosting,
}: GetBackgroundColorArgs): string => {
  if (isGhosting) {
    return colors.grey.light;
  }

  if (isSelected) {
    return colors.blue.light;
  }

  return colors.grey.light;
};

const getColor = ({
  isSelected,
  isGhosting,
}): string => {
  if (isGhosting) {
    return 'darkgrey';
  }
  if (isSelected) {
    return colors.blue.deep;
  }
  return colors.black;
};



const Content = styled.div`
    padding-top: 15px;
    padding-left: 25px;
    padding-right: 25px;
`;

const Title = styled.h4`
padding-left: 5px;
padding-bottom: 25px;
font-family: Helvetica Light;
font-size: 1.5em;
`;

const size: number = 30;

const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  color: ${colors.white};
  background: ${colors.blue.deep};
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};

export default class Task extends Component<Props> {

	constructor(props) {
	    super(props);
	}	
	
  // Using onClick as it will be correctly
  // preventing if there was a drag
  onClick = (event: MouseEvent) => {
    // marking the event as used
    event.preventDefault();
  };
  
  render() {
    
	const isShowDetails = this.props.isShowDetails;
	const selTask = this.props.selTask;
   
    let lDataTypeOptions = Object.entries(dataTypes).map((entry) => 
    	<option value={entry[0]}> {entry[1]} </option>
    );
    
    let loverWriteOptions = Object.entries(overWriteOptions).map((entry) => 
    	<MenuItem value={entry[0]}> {entry[1]} </MenuItem>
    );
    
    return (
    		 <Paper elevation={4}  sx={{paddingLeft:3,
  		        paddingRight:3,width: '100%',height:'750px' }} >

            {!isShowDetails  &&
               <Content>
              	<Alert bsStyle="info">
              	   <ul>
              	    <li>Drag variable from schema variables block to spread sheet variable block to create a template;</li>
              	    <li>Click variable in spread sheet variables container to edit template level variable information.</li>
              	  </ul>  
                </Alert>
              </Content>
            }
            {isShowDetails  &&
            		<Title>{selTask.csvLabel}</Title>
            }
          
            {isShowDetails  &&
            		<Stack spacing={3} >	
			
					<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="className"
	          		label="Entity name"
	          		value={selTask.entityName}
					/>
					
					
					<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="className"
	          		label="Column name"
	          		value={selTask.columnName}
					/>
					
					<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="className"
	          		label="Column name"
	          		value={dataTypes[selTask.type]}
					/>
					
					<FormControl fullWidth>
					  <InputLabel id="editableSelLabel">Editable</InputLabel>
					  <Select
					    labelId="editableSelLabel"
					    id="editable"
					    value={selTask.editable?'Y':'N'}
					    label="Editable"
					     onChange={(e) => this.props.handleEditable(e)}  
					    >
					    <MenuItem value={'Y'}>True</MenuItem>
					    <MenuItem value={'N'}>False</MenuItem>
					  </Select>
					</FormControl>
				
					<TextField
		          		InputProps={{
	            			readOnly: false,
	          			}}
		          		id="csvLabel"
		          		label="Column Label"
		          		value={selTask.csvLabel}
					/>
					
					
					<FormControl fullWidth>
					  <InputLabel id="overWriteOptionLabel">Select OverWrite Option</InputLabel>
					  <Select
					    labelId="overWriteOptionLabel"
					    id="overWriteOption"
					    value={selTask.editable?'Y':'N'}
					    label="Editable"
					    >
					  	{loverWriteOptions}
					  </Select>
					</FormControl>
					
					</Stack>
	        }
            </Paper>
    );
  }
}