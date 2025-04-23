export class Company {
    private _C_id: number;
    private _name: string;
    private _description: string;
    private _address: string;
    private _I_id: number | null = null; // Optional property

    constructor(C_id: number, name: string, description: string, address: string, I_id: number | null = null) {
        this._C_id = C_id;
        this._name = name;
        this._description = description;
        this._address = address;
        this._I_id = I_id;
    }

    get C_id(): number {
        return this._C_id;
    }

    set C_id(value: number) {
        this._C_id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get I_id(): number | null {
        return this._I_id;
    }

    set I_id(value: number | null) {
        this._I_id = value;
    }
    toString(): string {
        return `Company ID: ${this._C_id}, Name: ${this._name}, Description: ${this._description}, Address: ${this._address}, Image ID: ${this._I_id}`;
    }
}