export type UploadedFile =
  | {
      mimetype: string;
      fileContent: Uint8Array;
      size: number;
      directory?: undefined;
      fileName?: undefined;
      image_width?: number;
      image_height?: number;
    }
  | {
      mimetype: string;
      size: number;
      fileContent: Uint8Array;
      directory: string;
      fileName: string;
      image_width?: number;
      image_height?: number;
    };
