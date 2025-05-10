import {bufferToDate} from "../utils"

export class Review {
  private _R_id: number;
  private _H_id: number;
  private _U_id: number;
  private _title: string;
  private _description: string;
  private _rating: number;
  private _ts_created: Date;

  constructor(
    R_id: number,
    H_id: number,
    U_id: number,
    title: string,
    description: string,
    rating: number,
    ts_created: Date
  ) {
    this._R_id = R_id;
    this._H_id = H_id;
    this._U_id = U_id;
    this._title = title;
    this._description = description;
    this._rating = rating;
    this._ts_created = ts_created;
  }

  get R_id(): number {
    return this._R_id;
  }
  set R_id(value: number) {
    this._R_id = value;
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
  get Title(): string {
    return this._title;
  }
  set Title(value: string) {
    this._title = value;
  }
  get Description(): string {
    return this._description;
  }
  set Description(value: string) {
    this._description = value;
  }
  get Rating(): number {
    return this._rating;
  }
  set Rating(value: number) {
    this._rating = value;
  }
  get Ts_created(): Date {
    return this._ts_created;
  }
  set Ts_created(value: Date) {
    this._ts_created = value;
  }
  // Format the date for displaying in JSX
  getFormattedDate(): string {
    return this._ts_created.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export function transformToReview(data: any): Review {
  return new Review(
    data.R_id,
    data.H_id,
    data.U_id,
    data.Title,
    data.Description,
    data.Rating,
    bufferToDate(data.Ts_created)
  );
}
/**
   @todo: do this for all models
**/
