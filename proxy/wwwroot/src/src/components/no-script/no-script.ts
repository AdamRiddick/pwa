import { customElement, LitElement, html } from 'lit-element'; 

@customElement('no-script')
export default class NoScript extends LitElement { 
  render() {
    return html` 
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    `;
  }
}
