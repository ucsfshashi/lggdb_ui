import React, { Component } from 'react';
import styled from 'styled-components';
import memoizeOne from 'memoize-one';
import { Droppable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius } from './constants';
import Task from './task';
import type { DroppableProvided, DroppableStateSnapshot }  from 'react-beautiful-dnd';

type Props = {|
  column: ColumnType,
  tasks: TaskType[],
  selectedTaskIds: Id[],
  multiSelectTo: (taskId: Id) => void,
  draggingTaskId: ?Id,
  toggleSelection: (taskId: Id) => void,
  showTaskDetails: (taskId: Id) => void,
  toggleSelectionInGroup: (taskId: Id) => void,
  multiSelectTo: (taskId: Id) => void,
|}

const Container = styled.div`
  width: 500px;
  margin: ${grid}px;
  border-radius: ${borderRadius}px;
  border: 1px solid ${colors.grey.dark};
  background-color: ${colors.white.medium};
  /* we want the column to take up its full height */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  padding-left: ${grid}px;
  font-family: Helvetica Light;
  font-size: 1.5em;
 `;

const TaskList = styled.div`
  padding: ${grid}px;
  height: 700px;
  overflow:auto;
  font-family: Helvetica Light;
  font-size: 1.25em;
  transition: background-color 0.2s ease;
  ${props => (props.isDraggingOver ? `background-color: ${colors.blue.light}` : '')};
`;

type TaskIdMap = {
  [taskId: Id]: true,
}

const getSelectedMap = memoizeOne((selectedTaskIds: Id[]) =>
  selectedTaskIds.reduce((previous: TaskIdMap, current: Id): TaskIdMap => {
    previous[current] = true;
    return previous;
  }, {}));

export default class EntityColumn extends Component<Props> {
  render() {
    const column: ColumnType = this.props.column;
    const tasks: TaskType[] = this.props.tasks;
    const selectedTaskIds: Id[] = this.props.selectedTaskIds;
    const draggingTaskId: ?Id = this.props.draggingTaskId;
    return (
      <Container>
        <Title>hello hi</Title>
        <Droppable droppableId={column.id}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <TaskList
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {tasks.map((task: TaskType, index: number) => {
                const isSelected: boolean = Boolean(getSelectedMap(selectedTaskIds)[task.id]);
                const isGhosting: boolean =
                  isSelected && Boolean(draggingTaskId) && draggingTaskId !== task.id;
                return (
                  <Task
                    task={task}
                    index={index}
                    key={task.id}
                    isSelected={isSelected}
                    isGhosting={isGhosting}
                    selectionCount={selectedTaskIds.length}
                    showTaskDetails={this.props.showTaskDetails}
                    toggleSelection={this.props.toggleSelection}
                    toggleSelectionInGroup={this.props.toggleSelectionInGroup}
                    multiSelectTo={this.props.multiSelectTo}
                    showDetailInfo={this.props.showDetailInfo} 
                  />
                );
              })}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}