import { bufferToDate } from "../utils";

// User model class
export class User {
  private _U_id: number;
  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _password: string;
  private _phone: string;
  private _I_id: number | null = null; // Optional property
  private _ts_created: Date;

  constructor(
    U_id: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    phone: string,
    I_id: number | null = null,
    ts_created: Date
  ) {
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

  get Lastname(): string {
    return this._lastname;
  }

  set Lastname(value: string) {
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

  // Method to get the full name of the user
  getFullName(): string {
    return `${this.Firstname} ${this.Lastname}`;
  }

  // Method to get the user's image URL
  toString(): string {
    return `User ID: ${this._U_id}, Name: ${this.getFullName()}, Email: ${
      this._email
    }, Phone: ${this._phone}, Image ID: ${this._I_id}, Created At: ${
      this._ts_created
    }`;
  }

  // Method to convert the User object to a plain object
  toPlainObject(): Partial<User> {
    return {
      U_id: this.U_id,
      Firstname: this.Firstname,
      Lastname: this.Lastname,
      Email: this.Email,
      Phone: this.Phone,
      Password: this.Password,
      I_id: this.I_id,
      Ts_created: this.Ts_created,
    };
  }
}

// Function to transform raw data into a User object
export const transformToUser = (data: any): User => {
  return new User(
    data.U_id,
    data.Firstname,
    data.Lastname,
    data.Email,
    data.Password,
    data.Phone,
    data.I_id,
    bufferToDate(data.Ts_created)
  );
};

// Type for user update payload
export type UserUpdatePayload = Partial<
  Pick<
    User,
    "U_id" | "Firstname" | "Lastname" | "Email" | "Phone" | "Password" | "I_id"
  >
>;
