import { bufferToDate } from "../utils";

// Appointment model class
export class Appointment {
  private _A_id: number;
  private _H_id: number;
  private _U_id: number;
  private _R_id: number;
  private _title: string;
  private _message: string;
  private _date: Date;
  private _ts_created: Date;

  constructor(
    A_id: number,
    H_id: number,
    U_id: number,
    R_id: number,
    title: string,
    message: string,
    date: Date,
    ts_created: Date
  ) {
    this._A_id = A_id;
    this._H_id = H_id;
    this._U_id = U_id;
    this._R_id = R_id;
    this._title = title;
    this._message = message;
    this._date = date;
    this._ts_created = ts_created;
  }

  get A_id(): number {
    return this._A_id;
  }
  set A_id(value: number) {
    this._A_id = value;
  }
  get H_id(): number {
    return this._H_id;
  }
  set H_id(value: number) {
    this._H_id = value;
  }
  get U_id(): number {
    return this._U_id;
  }
  set U_id(value: number) {
    this._U_id = value;
  }
  get R_id(): number {
    return this._R_id;
  }
  set R_id(value: number) {
    this._R_id = value;
  }
  get Title(): string {
    return this._title;
  }
  set Title(value: string) {
    this._title = value;
  }
  get Message(): string {
    return this._message;
  }
  set Message(value: string) {
    this._message = value;
  }
  get Date(): Date {
    return this._date;
  }
  set Date(value: Date) {
    this._date = value;
  }
  get Ts_created(): Date {
    return this._ts_created;
  }
  set Ts_created(value: Date) {
    this._ts_created = value;
  }
  toString(): string {
    return `Appointment [A_id=${this._A_id}, H_id=${this._H_id}, U_id=${this._U_id}, R_id=${this._R_id}, title=${this._title}, message=${this._message}, date=${this._date}, ts_created=${this._ts_created}]`;
  }
}

// Function to transform raw data into an Appointment instance
export function transformToAppointment(data: any): Appointment {
  return new Appointment(
    data.A_id,
    data.H_id,
    data.U_id,
    data.R_id,
    data.Title,
    data.Message,
    data.Date,
    bufferToDate(data.Ts_created)
  );
}
