import apiService from '../api/api-service';
import nanoid from 'nanoid';
import { createAction } from 'redux-actions';
import { VisibilityFilter } from '../../state/todo/enums';
import actionTypes from '../actiontypes';


export const addTodo = createAction(actionTypes.TODO.ADD_TODO, (task: string): ITodo => ({ id: nanoid(), isComplete: false, task: task }));

export const clearCompleted = createAction(actionTypes.TODO.CLEAR_COMPLETED);

export const getTodos = (): any => apiService.get(actionTypes.TODO.GET_TODOS, `todos`);

export const updateFilter = createAction(actionTypes.TODO.UPDATE_FILTER, (filter: VisibilityFilter): VisibilityFilter => (filter));

export const updateTodoStatus = createAction(actionTypes.TODO.UPDATE_TODO_STATUS, (todo: ITodo, isComplete: boolean) => ({todo, isComplete}));
