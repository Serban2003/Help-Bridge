export class ProfileImage {
  private _I_id: number;
  private _name: string;
  private _data: { type: string; data: number[] }; // Assuming the image is stored as a Blob

  constructor(
    I_id: number,
    name: string,
    { type, data }: { type: string; data: number[] }
  ) {
    this._I_id = I_id;
    this._name = name;
    this._data = { type, data };
  }

  get I_id(): number {
    return this._I_id;
  }
  set I_id(value: number) {
    this._I_id = value;
  }

  get Name(): string {
    return this._name;
  }
  set Name(value: string) {
    this._name = value;
  }

  get Data(): { type: string; data: number[] } {
    return this._data;
  }
  set Data(value: { type: string; data: number[] }) {
    this._data = value;
  }

  /**
   * Converts a byte array to a base64 encoded string.
   * Handles large byte arrays efficiently.
   */
  static byteArrayToBase64(bytes: number[]): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Converts a base64 string to a data URL.
   * @param base64 - The base64 encoded varbinary string
   * @param mimeType - The MIME type of the image (e.g., 'image/png')
   */
  static fromBase64toImageUrl(
    base64: string,
    mimeType: string = "image/png"
  ): string {
    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * Combines byte array to image URL conversion.
   * Automatically detects the image type from the header.
   */
  static fromByteArrayToImageUrl(bytes: number[]): string {
    const base64 = this.byteArrayToBase64(bytes);

    // Try to detect image type (optional)
    const mimeType =
      bytes[0] === 255 && bytes[1] === 216 ? "image/jpeg" : "image/png";

    return this.fromBase64toImageUrl(base64, mimeType);
  }

  /**
   * Converts a raw byte array (e.g., Uint8Array) to an object URL for use in <img src="">
   * @param bytes - Raw binary data
   * @param mimeType - The MIME type of the image
   */
  static fromByteArray(
    bytes: Uint8Array,
    mimeType: string = "image/png"
  ): string {
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  toString(): string {
    return `Image ID: ${this._I_id}, Name: ${this._name}`;
  }
}

export function transformToProfileImage(data: any): ProfileImage {
  return new ProfileImage(data.I_id, data.Name, data.Data);
}
