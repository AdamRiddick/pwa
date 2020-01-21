import { createSelector } from 'reselect';
import { VisibilityFilter } from './enums';

const getTodosSelector = (state: any) => state.todo.todos;
const getFilterSelector = (state: any) => state.todo.filter;

export const getFilteredTodosSelector = createSelector(
  getTodosSelector, getFilterSelector, 
  (todos, filter) => { 
    switch (filter) {
        case VisibilityFilter.SHOW_ACTIVE:
            return todos.filter((todo: ITodo) => !todo.isComplete);
        case VisibilityFilter.SHOW_COMPLETED:
            return todos.filter((todo: ITodo) => todo.isComplete);
        default:
            return todos;
    }
  }
);