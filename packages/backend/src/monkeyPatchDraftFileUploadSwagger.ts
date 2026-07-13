import { PathsObject } from "openapi3-ts";

const draftFileUploadPath = "/api/v3/projects/{slug}/draft/files/{filePath}";

const draftFileUploadRequestBody = {
  description:
    'Multipart form data containing the draft file under the "file" field.',
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        required: ["file"],
        properties: {
          file: {
            type: "string",
            format: "binary",
            description:
              'Draft file to upload. The multipart field name must be "file".',
          },
        },
      },
    },
  },
};

/**
 * The ts-rest contract cannot express the multipart/form-data request body of
 * the draft file upload endpoint (its body is z.any()), so the generated
 * OpenAPI doc is patched here after generation.
 */
export function monkeyPatchDraftFileUploadSwagger(
  paths: PathsObject
): PathsObject {
  const draftFileUploadPost = paths[draftFileUploadPath]?.post;

  if (!draftFileUploadPost) {
    throw new Error(
      `monkeyPatchDraftFileUploadSwagger: expected [POST ${draftFileUploadPath}] in the generated OpenAPI paths, but it was not found. Was the writeDraftFile contract route changed? Update this patch to match.`
    );
  }

  return {
    ...paths,
    [draftFileUploadPath]: {
      ...paths[draftFileUploadPath],
      post: {
        ...draftFileUploadPost,
        requestBody: draftFileUploadRequestBody,
      },
    },
  };
}
