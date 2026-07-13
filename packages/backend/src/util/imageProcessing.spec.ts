import { describe, expect, test } from "vitest";
import sharp from "sharp";

import { createBlurHash } from "@util/imageProcessing";

describe("createBlurHash", () => {
  test("creates a blurhash for image content", async () => {
    const image = await sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    await expect(createBlurHash(image)).resolves.toEqual(expect.any(String));
  });
});
