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

    get Firstname(): string {
        return this._firstname;
    }

    set Firstname(value: string) {
        this._firstname = value;
    }

    get Fastname(): string {
        return this._lastname;
    }

    set Fastname(value: string) {
        this._lastname = value;
    }

    get Email(): string {
        return this._email;
    }

    set Email(value: string) {
        this._email = value;
    }

    get Password(): string {
        return this._password;
    }

    set Password(value: string) {
        this._password = value;
    }

    get Phone(): string {
        return this._phone;
    }

    set Phone(value: string) {
        this._phone = value;
    }

    get I_id(): number | null {
        return this._I_id;
    }

    set I_id(value: number | null) {
        this._I_id = value;
    }

    get Ts_created(): Date {
        return this._ts_created;
    }
    set Ts_created(value: Date) {
        this._ts_created = value;
    }

    getFullName(): string {
        return `${this.Firstname} ${this.Fastname}`;
    }

    toString(): string {
        return `User ID: ${this._U_id}, Name: ${this.getFullName()}, Email: ${this._email}, Phone: ${this._phone}, Image ID: ${this._I_id}, Created At: ${this._ts_created}`;
    }
}