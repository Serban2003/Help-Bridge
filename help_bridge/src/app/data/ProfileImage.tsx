export class ProfileImage {
    private _I_id: number;
    private _name: string;
    private _data: string; // Assuming the image is stored as a Blob

    constructor(I_id: number, name: string, data: string) {
        this._I_id = I_id;
        this._name = name;
        this._data = data;
    }

    get I_id(): number {
        return this._I_id;
    }
    set I_id(value: number) {   
        this._I_id = value;
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get data(): string {
        return this._data;
    }
    set data(value: string) {
        this._data = value;
    }

    /**
   * Converts a Base64 varbinary string to a data URL usable in <img src="">
   * @param base64 - The base64 encoded varbinary string
   * @param mimeType - The MIME type of the image (e.g., 'image/png')
   */
    static fromBase64(base64: string, mimeType: string = 'image/png'): string {
        return `data:${mimeType};base64,${base64}`;
    }

  /**
   * Converts a raw byte array (e.g., Uint8Array) to an object URL for use in <img src="">
   * @param bytes - Raw binary data
   * @param mimeType - The MIME type of the image
   */
    static fromByteArray(bytes: Uint8Array, mimeType: string = 'image/png'): string {
        const blob = new Blob([bytes], { type: mimeType });
        return URL.createObjectURL(blob);
    }

    toString(): string {
        return `Image ID: ${this._I_id}, Name: ${this._name}`;
    }
}