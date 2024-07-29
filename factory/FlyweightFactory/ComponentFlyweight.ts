import type { IFlyweightComponent } from "~/models/interfaces/IFlyweightComponent";  // Importa l'interfaccia

export class ComponentFlyweight<T> implements IFlyweightComponent<T> {
    private sharedState: string;  // Proprietà privata per lo stato condiviso
    public options: T;  // Proprietà pubblica per le opzioni

    constructor(private uniqueState: string, initialOptions: T) {  // Costruttore con stato unico e opzioni iniziali
        this.sharedState = 'common-state';  // Inizializza lo stato condiviso
        this.options = initialOptions;  // Inizializza le opzioni
    }

    configure(options: T): void {
        this.options = { ...this.options, ...options };
    }

    render(): string {  // Implementazione del metodo render
        return `<p>${this.sharedState} - ${this.uniqueState}</p>`;
    }
}
