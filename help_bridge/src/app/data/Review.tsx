export class Review {
    private _R_id: number;
    private _H_id: number;
    private _U_id: number;
    private _title: string;
    private _description: string;
    private _rating: number;
    private _ts_created: Date;

    constructor(R_id: number, H_id: number, U_id: number, title: string, description: string, rating: number, ts_created: Date) {
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
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        this._title = value;
    }
    get description(): string {
        return this._description;
    }
    set description(value: string) {
        this._description = value;
    }
    get rating(): number {
        return this._rating;
    }
    set rating(value: number) {
        this._rating = value;
    }
    get ts_created(): Date {
        return this._ts_created;
    }
    set ts_created(value: Date) {
        this._ts_created = value;
    }
}