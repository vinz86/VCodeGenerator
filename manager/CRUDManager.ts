export class CRUDManager<T> {
    constructor(private service: any, private entity: any) {}

    async getAll(params?: Partial<T>): Promise<T[]> {
        const methodName = `get${this.entity}s`;
        debugger
        return await this.service[methodName](params);
    }

    async getById(id: string): Promise<T> {
        const methodName = `get${this.entity}ById`;
        return await this.service[methodName](id);
    }

    async create(entity: T): Promise<T> {
        const methodName = `create${this.entity}`;
        return await this.service[methodName](entity);
    }

    async update(id: string, entity: Partial<T>): Promise<T> {
        const methodName = `update${this.entity}`;
        return await this.service[methodName](id, entity);
    }

    async delete(id: string): Promise<void> {
        const methodName = `delete${this.entity}`;
        return await this.service[methodName](id);
    }
}
