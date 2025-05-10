import { bufferToDate } from "../utils";

export class Availability {
  private _AV_id: number;
  private _H_id: number;
  private _date: Date;
  private _isBooked: number;
  private _A_id: number;

  constructor(
    AV_id: number,
    H_id: number,
    date: Date,
    isBooked: number,
    A_id: number
  ) {
    this._AV_id = AV_id;
    this._H_id = H_id;
    this._date = date;
    this._isBooked = isBooked;
    this._A_id = A_id;
  }

  get AV_id(): number {
    return this._AV_id;
  }
  set AV_id(value: number) {
    this._AV_id = value;
  }
  get H_id(): number {
    return this._H_id;
  }
  set H_id(value: number) {
    this._H_id = value;
  }

  get Date(): Date {
    return this._date;
  }
  set Date(value: Date) {
    this._date = value;
  }
  get IsBooked(): number {
    return this._isBooked;
  }
  set IsBooked(value: number) {
    this._isBooked = value;
  }
  get A_id(): number {
    return this._A_id;
  }
  set A_id(value: number) {
    this._A_id = value;
  }

  getFormattedTime(): string {
    return new Date(this._date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  }

  getFormattedDate(): string {
    return this._date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }
}

export function transformToAvailability(data: any): Availability {
  return new Availability(
    data.AV_id,
    data.H_id,
    data.Date,
    data.IsBooked,
    data.A_id
  );
}
