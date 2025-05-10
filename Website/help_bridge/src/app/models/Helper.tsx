import {bufferToDate} from "../utils"

export class Helper {
    private _H_id: number;
    private _HC_id: number;
    private _C_id: number;
    private _firstname: string;
    private _lastname: string;
    private _description: string;
    private _experience: number; // integer in months
    private _email: string;
    private _password: string;
    private _phone: string;
    private _I_id: number | null = null; // Optional property
    private _ts_created: Date;
    
    constructor(H_id: number, HC_id: number, C_id: number, firstname: string, lastname: string, description: string, experience: number, email: string, password: string, phone: string, I_id: number | null = null, ts_created: Date)
    {
        this._H_id = H_id;
        this._HC_id = HC_id;
        this._C_id = C_id;
        this._firstname = firstname;
        this._lastname = lastname;
        this._description = description;
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

    get Firstname(): string {
        return this._firstname;
    }
    set Firstname(value: string) {
        this._firstname = value;
    }

    get Lastname(): string {
        return this._lastname;
    }
    set Lastname(value: string) {
        this._lastname = value;
    }

    get Description(): string {
        return this._description;
    }
    set Description(value: string) {
        this._description = value;
    }

    get Experience(): number {
        return this._experience;
    }
    set Experience(value: number) {
        this._experience = value;
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
        return `${this.Firstname} ${this.Lastname}`;
    }

    getFormatedExperience(): string {
        var years = Math.floor(this.Experience / 12);
        var months = this.Experience % 12;
        
        var yearsStr = years > 1 ? "years" : "year";
        var monthsStr = months > 1 ? "months" : "month";

        if (years === 0 && months === 0) {
            return "No experience";
        }

        if (years === 0) {
            return `${months} ${monthsStr}`;
        }
        if (months === 0) {
            return `${years} ${yearsStr}`;
        }
        return `${years} ${yearsStr} and ${months} ${monthsStr}`;
    }

    toString(): string {
        return `Helper ID: ${this._H_id}, Company ID: ${this._C_id}, Name: ${this._firstname} ${this._lastname}, Description: ${this._description}, Experience: ${this.getFormatedExperience()}, Email: ${this._email}, Phone: ${this._phone}, Image ID: ${this._I_id}`;
    }
}

export const transformToHelper = (data: any): Helper => {
    return new Helper(
      data.H_id,
      data.HC_id,
      data.C_id,
      data.Firstname,
      data.Lastname,
      data.Description,
      data.Experience,
      data.Email,
      data.Password,
      data.Phone,
      data.I_id,
      bufferToDate(data.Ts_created)
    );
  };
  