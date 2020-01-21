import { connect } from 'pwa-helpers';
import store from '../../state/store';
import { customElement, LitElement, html, property } from 'lit-element'; 
import * as todoActions from '../../state/todo/actions';
import { VisibilityFilter } from '../../state/todo/enums';
import mapEnum from '../../utils/enumMap';

@customElement('todo-filter-selector')
export default class ToDoView extends connect(store)(LitElement) { 

    @property({ type: String })
    private filter: VisibilityFilter = VisibilityFilter.SHOW_ACTIVE;

    public render() {
        return html` 
            <div>
                ${mapEnum(VisibilityFilter, (item: string) => html`
                    <input type="radio" name="filter" ?checked=${item === this.filter} value="${item}" @change=${this.updateFilter}>${item}</input>
                `)}
            </div>
        `;
      }

    public stateChanged(state: any) { 
        this.filter = state.todo.filter;
    }

    private updateFilter(e: any) {
        store.dispatch(todoActions.updateFilter(e.currentTarget.value));
    }
}
