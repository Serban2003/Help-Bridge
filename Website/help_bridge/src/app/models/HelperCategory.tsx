export class HelperCategory{
    private _HC_id: number;
    private _name: string;
    private _description: string;

    constructor(HC_id: number, name: string, description: string) {
        this._HC_id = HC_id;
        this._name = name;
        this._description = description;
    }

    set HC_id(value: number) {
        this._HC_id = value;
    }

    get HC_id(): number {
        return this._HC_id;
    }

    set Name(value: string) {
        this._name = value;
    }

    get Name(): string {
        return this._name;
    }

    set Description(value: string) {    
        this._description = value;
    }

    get Description(): string {
        return this._description;
    }

    toString(): string {
        return `HelperCategory ID: ${this._HC_id}, Name: ${this._name}, Description: ${this._description}`;
    }
}

export function transformToCategory(data: any): HelperCategory {
    return new HelperCategory(
      data.HC_id,
      data.Name,
      data.Description
    );
  }