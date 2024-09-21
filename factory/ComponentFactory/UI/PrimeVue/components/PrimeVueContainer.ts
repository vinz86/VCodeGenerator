import { defineComponent, ref, h } from 'vue';
import { DIContainer } from "~/DIContainer/DIContainer";
import type { FlyweightFactory } from "~/factory/FlyweightFactory/FlyweightFactory";
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import { EServiceKeys } from '~/models/enum/EServiceKeys';

export class PrimeVueContainer implements IComponentFactory {
    private flyweightFactory = DIContainer.getService<FlyweightFactory<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    private flyweight: IFlyweightComponent<IDroppableComponent> | null = null;
    public options: IDroppableComponent;
    public children: IComponentFactory[] = [];

    constructor(options: IDroppableComponent = {} as IDroppableComponent) {
        this.options = options;
        this.setFlyweights();
    }

    setFlyweights(): void {
        this.flyweight = this.flyweightFactory.getFlyweight('container_PrimeVue', {
            cat: 'PrimeVue',
            className: '',
            inner: 'Inner',
            tag: 'div',
            style: "",
            attributes: {},
        });
        console.log('Flyweight creato:', this.flyweight);
    }

    configure(options: IDroppableComponent): void {
        if (this.flyweight) {
            this.options = { ...this.options, ...options };
            console.log('PrimeVueContainer configurato con opzioni:', this.options);
        } else {
            console.error('Nessun flyweight trovato per "container_PrimeVue"');
        }
    }

    render(): string {
        return 'div';
    }

    // Add child components
    addChild(component: IComponentFactory): void {
        this.children.push(component);
    }

    // Render children within the container
    renderChildren() {
        return this.children.map(child => h(child.render(), { ...child.options }));
    }
}

export default defineComponent({
    name: 'PrimeVueContainerComponent',
    props: {
        options: {
            type: Object as () => IDroppableComponent,
            default: () => ({})
        }
    },
    setup(props) {
        const container = new PrimeVueContainer(props.options);

        // For demonstration: Add some child components dynamically
        // This part should be adjusted based on actual use case
        container.addChild({ render: () => 'button', options: {} });  // Example child component
        container.addChild({ render: () => 'input', options: {} });   // Example child component

        return { container };
    },
    render() {
        return h('div', { class: this.container.options.className, style: this.container.options.style }, [
            ...this.container.renderChildren()
        ]);
    }
});