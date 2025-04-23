export class User {
    private _U_id: number;
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _password: string;
    private _phone: string;
    private _I_id: number | null = null; // Optional property
    private _ts_created: Date;

    constructor(U_id: number, firstname: string, lastname: string, email: string, password: string, phone: string, I_id: number | null = null, ts_created: Date) {
        this._U_id = U_id;
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._password = password;
        this._phone = phone;
        this._I_id = I_id;
        this._ts_created = ts_created;
    }

    get U_id(): number {
        return this._U_id;
    }

    set U_id(value: number) {
        this._U_id = value;
    }

    get firstname(): string {
        return this._firstname;
    }

    set firstname(value: string) {
        this._firstname = value;
    }

    get lastname(): string {
        return this._lastname;
    }

    set lastname(value: string) {
        this._lastname = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get phone(): string {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
    }

    get I_id(): number | null {
        return this._I_id;
    }

    set I_id(value: number | null) {
        this._I_id = value;
    }

    get ts_created(): Date {
        return this._ts_created;
    }
    set ts_created(value: Date) {
        this._ts_created = value;
    }

    getFullName(): string {
        return `${this.firstname} ${this.lastname}`;
    }

    toString(): string {
        return `User ID: ${this._U_id}, Name: ${this.getFullName()}, Email: ${this._email}, Phone: ${this._phone}, Image ID: ${this._I_id}, Created At: ${this._ts_created}`;
    }
}