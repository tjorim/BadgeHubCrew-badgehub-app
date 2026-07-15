import { createSwaggerDoc } from "@createSwaggerDoc";
import { describe, expect, it } from "vitest";

const swaggerDoc = createSwaggerDoc();

describe("createSwaggerDoc", () => {
  it("swagger doc should match snapshot", async () => {
    expect(swaggerDoc).toMatchSnapshot();
  });
});
