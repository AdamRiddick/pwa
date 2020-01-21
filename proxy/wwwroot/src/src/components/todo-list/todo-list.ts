import { connect } from 'pwa-helpers';
import store from '../../state/store';
import { customElement, LitElement, html, property } from 'lit-element'; 
import * as todoActions from '../../state/todo/actions';
import { getFilteredTodosSelector } from '../../state/todo/selectors';

@customElement('todo-list')
export default class ToDoView extends connect(store)(LitElement) { 

    @property({ type: Array })
    private todos: Array<ITodo> = [];

    public render() {
        return html` 
            <div>
                ${this.todos.map((todo: ITodo) => html`
                    <li><input type="checkbox" name="taskCompletion" value="${todo.task}" ?checked="${todo.isComplete}" @change="${(e: any) => {this.updateTodoStatus(todo, e.currentTarget.checked)}}">${todo.task}</li>
                `)}
            </div>

            <input type="button" @click="${this.updateTodoStatus}" value="To Complete - Update Status"></input>
        `;
      }

    public stateChanged(state: any) { 
        this.todos = getFilteredTodosSelector(state);
    }

    private updateTodoStatus(updatedTodo: ITodo, isComplete: boolean) {
        store.dispatch(todoActions.updateTodoStatus(updatedTodo, isComplete));
    }
}
