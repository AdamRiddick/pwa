import { customElement, LitElement, html } from 'lit-element'; 

import '../todo-view/todo-view'

@customElement('todo-app')
export default class ToDoApp extends LitElement { 
  render() {
    return html` 
      <todo-view></todo-view>
    `;
  }
}
