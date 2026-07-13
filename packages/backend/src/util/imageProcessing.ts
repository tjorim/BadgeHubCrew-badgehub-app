import { encode } from "blurhash";
import sharp from "sharp";
import { UploadedFile } from "@shared/domain/UploadedFile";
import { ImageDimensions } from "@domain/ImageDimensions";

export async function getImageProps(
  typedFile: UploadedFile
): Promise<ImageDimensions | {}> {
  let image_width: number | undefined;
  let image_height: number | undefined;

  // Check if the uploaded file is an image and get its dimensions 🖼️
  if (typedFile.mimetype.startsWith("image/")) {
    try {
      const metadata = await sharp(typedFile.fileContent).metadata();
      image_width = metadata.width;
      image_height = metadata.height;
      return {
        image_width,
        image_height,
      };
    } catch (e) {
      console.error("Sharp failed to read image metadata", e);
      // Fail gracefully if metadata cannot be read
    }
  }
  return {};
}

export async function createIconBuffer(
  fileContent: Uint8Array,
  targetOptions: ImageDimensions
): Promise<Buffer> {
  return sharp(fileContent)
    .resize(targetOptions.image_width, targetOptions.image_height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

export async function createBlurHash(
  fileContent: Uint8Array
): Promise<string | undefined> {
  try {
    const { data, info } = await sharp(fileContent)
      .resize(32, 32, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
  } catch (e) {
    console.error("Sharp failed to create blurhash", e);
    return undefined;
  }
}
