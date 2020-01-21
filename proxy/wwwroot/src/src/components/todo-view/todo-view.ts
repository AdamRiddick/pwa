import { connect } from 'pwa-helpers';
import store from '../../state/store';
import { customElement, LitElement, html, property } from 'lit-element'; 
import * as todoActions from '../../state/todo/actions';

import '../todo-filter-selector/todo-filter-selector'
import '../todo-list/todo-list'
import { IMessage } from '../../state/types';
import { MessageType } from '../../state/enums';


@customElement('todo-view')
export default class ToDoView extends connect(store)(LitElement) { 

    @property({ type: Object })
    private message: IMessage = { text: '', type: MessageType.Info };

    @property({ type: String })
    private task = '';

    public render() {
        return html` 
            <div>
                <p>Message Type: ${this.message.type}</p>
                <p>Message: ${this.message.text}</p>
            </div>
            <div @keyup="${this.shortcutListener}">
                <input type="text" placeholder="Task" value="${this.task}" @change=${this.updateTask} />
                <input type="button" @click="${this.addTodo}" value="Add Todo" />
            </div>
            <div>
                <todo-list></todo-list>
            </div>

            <todo-filter-selector></todo-filter-selector>

            <input type="button" @click="${this.clearCompleted}" value="Clear Completed" />
        `;
    }

    stateChanged(state: any) {
        this.message = state.todo.message;
    }

    private addTodo() {
        if (this.task) {
            store.dispatch(todoActions.addTodo(this.task));
            this.task = '';
          }
    }

    private clearCompleted() {
        store.dispatch(todoActions.clearCompleted());
    }

    private updateTask(e: any) {
        this.task = e.target.value;
      }

    private shortcutListener(e: any) {
        if (e.key === 'Enter') {
          this.addTodo();
        }
    }
}
