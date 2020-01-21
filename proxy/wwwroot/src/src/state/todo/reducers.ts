import { produce } from 'immer';
import { handleActions } from 'redux-actions';
import { MessageType } from '../enums';
import { VisibilityFilter } from './enums';
import actionTypes from '../actiontypes';

const initialState = {
    filter: VisibilityFilter.SHOW_ACTIVE,
    isFetching: false,
    message: {
        type: MessageType.Info,
        text: ''
    },
    todos: []
};

export default handleActions({
    [actionTypes.TODO.ADD_TODO]: (state: any, action: any) => {
        return produce(state, (newState: any) => {
            newState.todos.push(action.payload);
        });
    },
    [actionTypes.TODO.CLEAR_COMPLETED]: (state: any, _: any) => {
        return produce(state, (newState: any) => {
            newState.todos = state.todos.filter((todo: any) => !todo.isComplete)
        });
    },
    [`${actionTypes.TODO.GET_TODOS}_REQUEST`]: (state: any) => {
        return produce(state, (newState: any) => {
            newState.isFetching = true;
            newState.message.type = MessageType.Info;
            newState.message.text = 'Loading todos ...';
        });
    },
    [`${actionTypes.TODO.GET_TODOS}_SUCCESS`]: (state: any, action: any) => {
        return produce(state, (newState: any) => {
            newState.isFetching = false;
            newState.message.type = MessageType.Success;
            newState.message.text = 'Todo\'s loaded.';
            newState.todos = action.payload;
        });
    },
    [`${actionTypes.TODO.GET_TODOS}_FAILURE`]: (state: any) => {
        return produce(state, (newState: any) => {
            newState.isFetching = false;
            newState.message.type = MessageType.Warning;
            newState.message.text = 'Unable to fetch current todo\'s, operating in offline mode.';
        });
    },
    [actionTypes.TODO.UPDATE_FILTER]: (state: any, action: any) => {
        return produce(state, (newState: any) => {
            newState.filter = action.payload;
        });
    },
    [actionTypes.TODO.UPDATE_TODO_STATUS]: (state: any, action: any) => {
        return produce(state, (newState: any) => {
            newState.todos = state.todos.map((todo: ITodo) =>
                todo.id === action.payload.todo.id 
                  ? { ...action.payload.todo, isComplete: action.payload.isComplete }
                  : todo
              )
        });
    },
}, initialState);
