import React, { Component } from 'react';
import styled from 'styled-components';
import { DragStart, DropResult, DraggableLocation,DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import EntityColumn from './entity_column';
import type { Result as ReorderResult } from './utils';
import { mutliDragAwareReorder, multiSelectTo as multiSelect } from './utils';
import TaskInfo from './taskInfo';

import {Stack} from '@mui/material';


const Container = styled.div`
  display: flex;
  user-select: none;
`;

type State = {|
  entities: Entities,
  selectedTaskIds: Id[],
  // sad times
  draggingTaskId: ?Id,
|};

const entities: Entities = {
      columnOrder :['todo','done'],
	  columns: {
	    todo: {id: 'todo',
				 title: 'Schema variables',
				 tasks: [{
		"id" :"Patient.mrn",		 
        "csvLabel": "MRN",
        "entityName": "Patient",
        "columnName": "mrn",
        "type": "TEXT",
        "overWriteOption": "NOOVERWRITE"
      },
      {
        "id" :"Patient.sex",
        "csvLabel": "Sex",
        "entityName": "Patient",
        "columnName": "gender",
        "type": "TEXT",
        "overWriteOption": "NONEMPTYOVERWRITE"
      },
      {
        "id" :"Patient.dob",
        "csvLabel": "DOB",
        "entityName": "Patient",
        "columnName": "dateOfBirth",
        "type": "DATE",
        "overWriteOption": "NONEMPTYOVERWRITE"
      },
      {
        "id" :"Surgery.surgeryDate",
        "csvLabel": "Date of Procedure",
        "entityName": "Surgery",
        "columnName": "surgeryDate",
        "type": "DATE",
        "overWriteOption": "NOOVERWRITE"
      },
      {
        "id" :"Epidemiology.epiDate",
        "csvLabel": "AGS DXDATE",
        "entityName": "Epidemiology",
        "columnName": "epiDate",
        "type": "DATE",
        "overWriteOption": "NOOVERWRITE"
      },
      {
        "id" :"ClinicalEvaluation.presentingComplaint",
        "csvLabel": "Presenting Complaint",
        "entityName": "ClinicalEvaluation",
        "columnName": "presentingComplaint",
        "type": "TEXT",
        "overWriteOption": "NONEMPTYOVERWRITE"
      }]},
	 done: { id: 'done',
				  title: 'Spread sheet variables',
				  tasks: [],}
	  }
};

const getTasks = (entities: Entities, columnId: Id): Task[] => entities.columns[columnId].tasks;


export default class TaskApp extends Component<*, State> {

	constructor(props) {
	    super(props);
	    
	    entities.columns['todo'].tasks = props.schemaVariables 
	    entities.columns['done'].tasks = props.spreadSheetVariables;
	    
	    this.state = {
		    entities: entities,
	    	selectedTaskIds: [],
	    	draggingTaskId: null,
	    	isShowDetails : false,
	    	selTask: null,
	    };
	}

  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
    window.addEventListener('keydown', this.onWindowKeyDown);
    window.addEventListener('touchend', this.onWindowTouchEnd);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
    window.removeEventListener('keydown', this.onWindowKeyDown);
    window.removeEventListener('touchend', this.onWindowTouchEnd);
  }

  onDragStart = (start: DragStart) => {
    const id: string = start.draggableId;
    const selected: ?Id = this.state.selectedTaskIds.find((taskId: Id): boolean => taskId === id);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      this.unselectAll();
    }
    this.setState({
      draggingTaskId: start.draggableId,
    });
  }

  onDragEnd = (result: DropResult) => {
    const destination: ?DraggableLocation = result.destination;
    const source: DraggableLocation = result.source;

    // nothing to do
    if (!destination || result.reason === 'CANCEL') {
      this.setState({
        draggingTaskId: null,
      });
      return;
    }

    const processed: ReorderResult = mutliDragAwareReorder({
      entities: this.state.entities,
      selectedTaskIds: this.state.selectedTaskIds,
      source,
      destination,
    });

	if(this.props.handleTemplateChange) {
		this.props.handleTemplateChange(
		processed.entities.columns["done"].tasks);	
	}

    this.setState({
      ...processed,
      draggingTaskId: null,
    });
  }

  

  onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      this.unselectAll();
    }
  }

  onWindowClick = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  }

  onWindowTouchEnd = (event: TouchEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    this.unselectAll();
  }
  
  showTaskDetails = (task: Task,isSelected:boolean) => {
    console.log("task : "+ task.id+ "  isSelected : "+ isSelected );
    
    this.setState({
      isShowDetails : !isSelected,
      selTask: task,
    });
  }
  
  handleTaskInfoChange= (e) => {
 	 const target = e.target;
 	 const name = target.name;
 	 const value = target.type === 'checkbox' ?
  		   target.checked : target.value;
 
	 let lSelTask = this.state.selTask;
	 lSelTask[name] = value;

	 this.setState({
      selTask: lSelTask,
     });
  }
  
  toggleSelection = (taskId: Id) => {
    const selectedTaskIds: Id[] = this.state.selectedTaskIds;
    const wasSelected: boolean = selectedTaskIds.includes(taskId);

    const newTaskIds: Id[] = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTaskIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    this.setState({
      selectedTaskIds: newTaskIds,
    });
  }

  toggleSelectionInGroup = (taskId: Id) => {
    
    const selectedTaskIds: Id[] = this.state.selectedTaskIds;
    const index: number = selectedTaskIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      this.setState({
        selectedTaskIds: [...selectedTaskIds, taskId],
      });
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow: Id[] = [...selectedTaskIds];
    shallow.splice(index, 1);
    this.setState({
      selectedTaskIds: shallow,
    });
    
    
  }

  // This behaviour matches the MacOSX finder selection
  multiSelectTo = (newTaskId: Id) => {
    const updated: ?Id[] = multiSelect(
      this.state.entities,
      this.state.selectedTaskIds,
      newTaskId
    );

    if (updated == null) {
      return;
    }

    this.setState({
      selectedTaskIds: updated,
    });
  }

  unselect = () => {
    this.unselectAll();
  };

  unselectAll = () => {
    this.setState({
      selectedTaskIds: [],
    });
  }

  render() {
    
    const entities: Entities = this.state.entities;
    const selected: Id[] = this.state.selectedTaskIds;
    
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd} >
        <Stack direction="row" alignItems="center" spacing={1}>  
          <EntityColumn
              column={entities.columns['todo']}
              tasks={getTasks(entities, 'todo')}
              selectedTaskIds={selected}
              key={'todo'}
              draggingTaskId={this.state.draggingTaskId}
              toggleSelection={this.toggleSelection}
              toggleSelectionInGroup={this.toggleSelectionInGroup}
              multiSelectTo={this.multiSelectTo}
            />
            
           <Column
              column={entities.columns['done']}
              tasks={getTasks(entities, 'done')}
              selectedTaskIds={selected}
              key={'done'}
              draggingTaskId={this.state.draggingTaskId}
              showTaskDetails={this.showTaskDetails}
              toggleSelection={this.toggleSelection}
              toggleSelectionInGroup={this.toggleSelectionInGroup}
              multiSelectTo={this.multiSelectTo}
              showDetailInfo={true}
            />
            <TaskInfo  
             isShowDetails = {this.state.isShowDetails}
             selTask= {this.state.selTask}
             onChange={this.handleTaskInfoChange}
            />
        </Stack>
      </DragDropContext>
    );
  }
}