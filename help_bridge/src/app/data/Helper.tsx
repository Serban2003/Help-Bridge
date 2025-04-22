export class Helper {
    private _H_id: number;
    private _HC_id: number;
    private _C_id: number;
    private _firstname: string;
    private _lastname: string;
    private _description: string;
    private _age: number; // integer
    private _experience: number; // integer in months
    private _email: string;
    private _password: string;
    private _phone: string;
    private _I_id: number | null = null; // Optional property
    private _ts_created: Date;
    
    constructor(H_id: number, HC_id: number, C_id: number, firstname: string, lastname: string, description: string,
                age: number, experience: number, email: string, password: string, phone: string, I_id: number | null = null, ts_created: Date)
    {
        this._H_id = H_id;
        this._HC_id = HC_id;
        this._C_id = C_id;
        this._firstname = firstname;
        this._lastname = lastname;
        this._description = description;
        this._age = age;
        this._experience = experience;
        this._email = email;
        this._password = password;
        this._phone = phone;
        this._I_id = I_id;
        this._ts_created = ts_created;
    }

    get H_id(): number {
        return this._H_id;
    }
    set H_id(value: number) {
        this._H_id = value;
    }

    get HC_id(): number {
        return this._HC_id;
    }
    set HC_id(value: number) {
        this._HC_id = value;
    }

    get C_id(): number {
        return this._C_id;
    }
    set C_id(value: number) {
        this._C_id = value;
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

    get description(): string {
        return this._description;
    }
    set description(value: string) {
        this._description = value;
    }

    get age(): number {
        return this._age;
    }
    set age(value: number) {
        this._age = value;
    }

    get experience(): number {
        return this._experience;
    }
    set experience(value: number) {
        this._experience = value;
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

    getFormatedExperience(): string {
        var years = Math.floor(this.experience / 12);
        var months = this.experience % 12;
        
        var yearsStr = years > 1 ? "years" : "year";
        var monthsStr = months > 1 ? "months" : "month";

        if (years === 0 && months === 0) {
            return "No experience";
        }
        return `${years} ${yearsStr} and ${months} ${monthsStr}`;
    }

    toString(): string {
        return `Helper ID: ${this._H_id}, Company ID: ${this._C_id}, Name: ${this._firstname} ${this._lastname}, Description: ${this._description}, Age: ${this._age}, Experience: ${this.getFormatedExperience()}, Email: ${this._email}, Phone: ${this._phone}, Image ID: ${this._I_id}`;
    }
}