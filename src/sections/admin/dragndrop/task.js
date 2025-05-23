import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius } from './constants';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import type { Id, Task as TaskType } from './types';
import DetailTask from './detailTask';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';


import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;

type Props = {|
  task: TaskType,
  index: number,
  isSelected: boolean,
  isGhosting: boolean,
  selectionCount: number,
  toggleSelection: (taskId: Id) => void,
  showTaskDetails: (taskId: Id) => void,
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
  onKeyDown = (
    event: KeyboardEvent,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    if (provided.dragHandleProps) {
      provided.dragHandleProps.onKeyDown(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== keyCodes.enter) {
      return;
    }

    // we are using the event for selection
    event.preventDefault();

    const wasMetaKeyUsed: boolean = event.metaKey;
    const wasShiftKeyUsed: boolean = event.shiftKey;

    this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
  }

  // Using onClick as it will be correctly
  // preventing if there was a drag
  onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    const wasMetaKeyUsed: boolean = event.metaKey;
    const wasShiftKeyUsed: boolean = event.shiftKey;

    this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
    
    if(this.props.showTaskDetails) {
    	this.props.showTaskDetails(this.props.task,
    			this.props.isSelected);
    }
  };

  onTouchEnd = (event: TouchEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    // marking the event as used
    // we would also need to add some extra logic to prevent the click
    // if this element was an anchor
    event.preventDefault();
    this.props.toggleSelectionInGroup(this.props.task.id);
  }

  performAction = (wasMetaKeyUsed: boolean, wasShiftKeyUsed: boolean) => {
    const {
      task,
      toggleSelection,
      toggleSelectionInGroup,
      multiSelectTo,
    } = this.props;

    if (wasMetaKeyUsed) {
      toggleSelectionInGroup(task.id);
      return;
    }

    if (wasShiftKeyUsed) {
      multiSelectTo(task.id);
      return;
    }

    toggleSelection(task.id);
  }

  render() {
    const task: TaskType = this.props.task;
    const index: number = this.props.index;
    const isSelected: boolean = this.props.isSelected;
    const selectionCount: number = this.props.selectionCount;
    const isGhosting: boolean = this.props.isGhosting;
   
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
          const shouldShowSelection: boolean = snapshot.isDragging && selectionCount > 1;
          return (
            <Container  component="div"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={this.onClick}
              onTouchEnd={this.onTouchEnd}
              onKeyDown={(event: KeyboardEvent) => this.onKeyDown(event, provided, snapshot)}
              isDragging={snapshot.isDragging}
              isSelected={isSelected}
              isGhosting={isGhosting}
            >
              {this.props.showDetailInfo && 
	               <Box component="div" sx= {{padding: '14px',
	                  border: '1px double',
	                  '&:hover': {
	                      backgroundColor: 'primary.main',
	                      opacity: [0.9, 0.8, 0.7],
	                    },
	                  margin: '9px',
	                  borderRadius: '5px',
	                  fontWeight: '400',
	                  lineHeight: '1.5714285714285714',
	                  fontSize: '1.0rem',
	                  fontFamily: 'Public Sans,sans-serif',
	                  color: '#212B36'}}>
                     
                    <Stack direction="row" spacing={2}>	
          			<Box sx= {{paddingTop: '10px',
          		    fontWeight: '700',
          		    fontSize: 'large' }}><FormatListBulletedOutlinedIcon/>
          		    </Box>
          			<Box sx= {{paddingTop: '10px',
          		    fontWeight: '700',
          		    fontSize: 'large' }}> {task.entityName} - {task.columnName} </Box>
          		    </Stack>
                    <DetailTask task={task} />
	              </Box>
              }
              
              {!this.props.showDetailInfo && 
            	  
            	  <Box component="div" sx= {{
	                  border: '1px double',
	                  '&:hover': {
	                      backgroundColor: 'primary.main',
	                      opacity: [0.9, 0.8, 0.7],
	                    },
	                  margin: '9px',
	                  borderRadius: '5px',
	                  fontWeight: '400',
	                  fontSize: '1.0rem',
	                  fontFamily: 'Public Sans,sans-serif',
	                  color: '#212B36'}}>
              		
              		<Stack direction="row" spacing={2}>	
              			<Box sx= {{paddingTop: '10px',
              		    fontWeight: '700',
              		    fontSize: 'large' }}><DragIndicatorOutlinedIcon/>
              		    </Box>
              			<Box sx= {{paddingTop: '10px',
              		    fontWeight: '700',
              		    fontSize: 'large' }}> {task.csvLabel} </Box>
              		</Stack>
	                
	              </Box>
            	  
              }	  
              
              {shouldShowSelection ? <Box component="div" >{selectionCount}</Box> : null}
            </Container>
          );
        }}
      </Draggable>
    );
  }
}