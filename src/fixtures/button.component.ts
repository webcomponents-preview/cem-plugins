/// <reference lib="dom" />

/* eslint-disable @typescript-eslint/no-unused-vars */
type CustomElementClass = Omit<typeof HTMLElement, 'new'>;
type CustomElement = (tagName: string) => (classOrDescriptor: CustomElementClass) => any;
const customElement: CustomElement = () => () => null;

type PropertyOptions = { reflect: boolean; attribute: string; type: any };
const property = (options?: Partial<PropertyOptions>): PropertyDecorator => null;

const html = (strings: TemplateStringsArray, ...values: any[]) => null;

declare abstract class LitElement extends HTMLElement {}

/**
 * A simple button fixture element
 *
 * @example
 * ```html
 * <test-button label="Hello Moon!">Artemis is coming!</test-button>
 *
 * @slot - This slot will be used as a label for the button.
 * @csspart button - The button
 * @cssprop --test-button-color - The color of the button
 */
@customElement('test-button')
export class Button extends LitElement {
  @property({ type: String }) label = 'Hello World!';

  render() {
    return html`
      <button part="button">
        ${this.label}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-button': Button;
  }
}
