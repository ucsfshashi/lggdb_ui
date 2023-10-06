import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius,dataTypes,overWriteOptions } from './constants';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FormGroup,Form,FormControlLabel,FormControl,Alert} from '@mui/material';


// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;


function FieldGroup({ id, label, help, ...props }) {
	  return (
	    <FormGroup controlId={id}>
	      <FormControlLabel>{label}</FormControlLabel>
	      <FormControl {...props} />
	    </FormGroup>
	  );
	}
//{help && <HelpBlock>{help}</HelpBlock>}

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

const Container = styled.div`
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};
  width: 500px;
  margin: ${grid}px;
  align-content:middle;
  border-radius: ${borderRadius}px;4
  font-size: 18px;
  border: 2px solid ${colors.shadow};
  ${props => (props.isDragging ? `box-shadow: 2px 2px 1px ${colors.shadow};` : '')}
  ${props => (props.isGhosting ? 'opacity: 0.8;' : '')}
  /* needed for SelectionCount */
  position: relative;
  /* avoid default outline which looks lame with the position: absolute; */
  &:focus {
    outline: none;
    border-color: ${colors.blue.deep};
  }
`;

const Content = styled.div`
    padding-top: 15px;
    padding-left: 25px;
    padding-right: 25px;
`;

const Title = styled.h3`
padding-left: ${grid}px;
font-family: Helvetica Light;
font-size: 1.75em;
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
    	<option value={entry[0]}> {entry[1]} </option>
    );
    
    return (
            <Container >

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
                <Content>
            		<Title>{selTask.csvLabel}</Title>
            	</Content>
            }
            
            {isShowDetails  &&
              <Content>
	              <form>
	              <FormGroup>
	              	<FormControlLabel>Entity name</FormControlLabel>
	              	<FormControl.Static>{selTask.entityName}</FormControl.Static>
	              </FormGroup>
	             <FormGroup>
	             	<FormControlLabel>Column name</FormControlLabel>
	             	<FormControl.Static>{selTask.columnName}</FormControl.Static>
	             </FormGroup>
	             <FormGroup>
	             	<FormControlLabel>Editable</FormControlLabel>
	             	<FormControl.Static>{selTask.editable==true?"Yes":"No"}</FormControl.Static>
	             </FormGroup>
	              <FieldGroup
	                name="csvLabel"
	                id="csvLabel"
	                type="text"
	                label="Column label"
	                placeholder="Enter column label"
	                onChange={this.props.onChange}	
	                value={selTask.csvLabel}	
	              />
            	 <FormGroup controlId="type">
	              <FormControlLabel>Column DataType</FormControlLabel>
	               <FormControl.Static>{dataTypes[selTask.type]}</FormControl.Static>
	            </FormGroup>
         	    <FormGroup controlId="overWriteOption">
	              		<FormControlLabel>Overwrite Option</FormControlLabel>
	              		<FormControl name="overWriteOption" componentClass="select" onChange={this.props.onChange} placeholder="Select OverWrite Option" value={selTask.overWriteOption}>
	              			{loverWriteOptions}
	              		</FormControl>
	              </FormGroup>
	              </form>	
              </Content> }
            </Container>
    );
  }
}