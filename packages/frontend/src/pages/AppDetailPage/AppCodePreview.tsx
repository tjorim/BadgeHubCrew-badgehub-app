import React, { useEffect, useState } from "react";
import { publicTsRestClient } from "@api/tsRestClient.ts";
import { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import { FileMetadata } from "@shared/domain/readModels/project/FileMetadata.ts";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-slate-300 hover:text-slate-100"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={{ display: "inline", verticalAlign: "middle" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
    />
  </svg>
);

// Helper function to determine preview type based on mimetype
const getPreviewType = (mimetype: string): string => {
  if (mimetype.startsWith("image/")) {
    return "image";
  }
  if (mimetype === "application/json") {
    return "json";
  }
  if (
    mimetype === "text/x-python" ||
    mimetype === "application/x-python-code" ||
    mimetype === "text/x-python-script"
  ) {
    return "python";
  }
  if (mimetype === "text/plain" || mimetype.startsWith("text/")) {
    return "text";
  }
  return "unsupported";
};

// JSON Preview Component with pretty print option
const JsonPreview: React.FC<{ content: string }> = ({ content }) => {
  const [isPretty, setIsPretty] = useState(false);

  const formatJson = (jsonStr: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch {
      return jsonStr; // Return original if parsing fails
    }
  };

  const displayContent = isPretty ? formatJson(content) : content;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-slate-300 text-sm">JSON file</span>
        <button
          onClick={() => setIsPretty(!isPretty)}
          className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs hover:bg-slate-600"
        >
          {isPretty ? "Show Raw" : "Pretty Print"}
        </button>
      </div>
      <pre className="text-green-400">
        <code>{displayContent}</code>
      </pre>
    </div>
  );
};

// Python Preview Component with basic highlighting and formatting
const PythonPreview: React.FC<{ content: string }> = ({ content }) => {
  const [isFormatted, setIsFormatted] = useState(false);

  const formatPython = (code: string) => {
    try {
      // Basic Python formatting - ensure proper indentation and line spacing
      const lines = code.split("\n");
      let indentLevel = 0;
      const formatted = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        // Decrease indent for lines that end blocks
        if (trimmed.match(/^(return|break|continue|pass)\s*$/)) {
          // Keep current indent level for these statements
        } else if (line.match(/^\s*(elif|else|except|finally)/)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const result = "    ".repeat(indentLevel) + trimmed;

        // Increase indent after lines that start new blocks
        if (
          trimmed.endsWith(":") &&
          (trimmed.startsWith("def ") ||
            trimmed.startsWith("class ") ||
            trimmed.startsWith("if ") ||
            trimmed.startsWith("elif ") ||
            trimmed.startsWith("else:") ||
            trimmed.startsWith("for ") ||
            trimmed.startsWith("while ") ||
            trimmed.startsWith("try:") ||
            trimmed.startsWith("except") ||
            trimmed.startsWith("finally:") ||
            trimmed.startsWith("with "))
        ) {
          indentLevel += 1;
        }

        return result;
      });

      return formatted.join("\n");
    } catch {
      return code; // Return original if formatting fails
    }
  };

  const displayContent = isFormatted ? formatPython(content) : content;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-slate-300 text-sm">Python file</span>
        <button
          onClick={() => setIsFormatted(!isFormatted)}
          className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs hover:bg-slate-600"
        >
          {isFormatted ? "Show Original" : "Format Code"}
        </button>
      </div>
      <pre className="text-blue-400">
        <code>{displayContent}</code>
      </pre>
    </div>
  );
};

// Text Preview Component (existing behavior)
const TextPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <pre>
      <code>{content}</code>
    </pre>
  );
};

// Image Preview Component
const ImagePreview: React.FC<{ file: FileMetadata }> = ({ file }) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-slate-300 text-sm">
          Image file{" "}
          {file.image_width &&
            file.image_height &&
            `(${file.image_width}×${file.image_height})`}
        </span>
      </div>
      <div className="flex justify-center">
        <img
          src={file.url}
          alt={file.full_path}
          className="max-w-full max-h-96 rounded border border-slate-600"
          style={{ maxHeight: "400px" }}
        />
      </div>
    </div>
  );
};

// No Preview Component for unsupported types
const NoPreview: React.FC<{ mimetype: string }> = ({ mimetype }) => {
  return (
    <div className="text-center py-8 text-slate-400">
      <p>Preview not available for this file type.</p>
      <p className="text-sm mt-2">MIME type: {mimetype}</p>
      <p className="text-sm">Use the download button to view the file.</p>
    </div>
  );
};

const AppCodePreview: React.FC<{ project: ProjectDetails }> = ({ project }) => {
  const files = project?.version?.files ?? [];
  const [previewedFile, setPreviewedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the currently previewed file metadata
  const currentFile = files.find((f) => f.full_path === previewedFile) || null;

  // Find __init__.py by default
  useEffect(() => {
    if (!files?.length) {
      setPreviewedFile(null);
      setFileContent(null);
      return;
    }
    const initFile = files.find(
      (f) =>
        (f.name === "__init__" && f.ext === "py") ||
        f.full_path === "__init__.py"
    );
    if (initFile) {
      setPreviewedFile(initFile.full_path);
    } else {
      setPreviewedFile(null);
      setFileContent(null);
    }
  }, [files]);

  // Fetch file content when previewedFile changes
  useEffect(() => {
    if (!previewedFile || !currentFile) {
      setFileContent(null);
      return;
    }

    // For images, we don't need to fetch content - we'll display them directly
    if (getPreviewType(currentFile.mimetype) === "image") {
      setFileContent(null);
      setLoading(false);
      return;
    }

    // For unsupported types, don't fetch content
    if (getPreviewType(currentFile.mimetype) === "unsupported") {
      setFileContent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    publicTsRestClient
      .getLatestPublishedFile({
        params: {
          slug: project.slug,
          filePath: previewedFile,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          if (typeof res.body === "string") {
            setFileContent(res.body);
          } else if (res.body instanceof Blob) {
            res.body.text().then(setFileContent);
          } else {
            setFileContent("// Unable to display file content");
          }
        } else {
          setFileContent("// Unable to load file");
        }
        setLoading(false);
      });
  }, [previewedFile, project.slug, currentFile]);

  const handlePreview = (fullPath: string) => {
    setPreviewedFile(fullPath);
  };

  const handleDownload = (url: string) => {
    window.location.href = url;
  };

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-left">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">
        Code Preview / Files
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 w-full">
          <h3 className="text-lg font-medium text-slate-200 mb-2">
            Project Files:
          </h3>
          <ul className="list-none text-slate-400 text-sm space-y-1">
            {files.map((f, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <button
                  className="px-1 py-1 bg-slate-700 rounded hover:bg-slate-600"
                  onClick={() => handleDownload(f.url)}
                  title="Download file"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <DownloadIcon />
                </button>
                <button
                  className={`text-left hover:underline font-mono ${
                    previewedFile === f.full_path
                      ? "text-slate-100 font-bold"
                      : "text-slate-400"
                  }`}
                  onClick={() => handlePreview(f.full_path)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  title="Preview file"
                >
                  {f.full_path}
                </button>
                {f.size_formatted ? (
                  <span className="ml-2 text-slate-500">
                    {f.size_formatted}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 md:ml-0">
        <div className="code-block font-mono text-sm bg-gray-900 rounded p-4 overflow-x-auto min-h-[200px]">
          {loading ? (
            <div className="text-slate-400">Loading file...</div>
          ) : !previewedFile ? (
            <div className="text-slate-400">No file selected</div>
          ) : !currentFile ? (
            <div className="text-slate-400">File not found</div>
          ) : (
            (() => {
              const previewType = getPreviewType(currentFile.mimetype);

              switch (previewType) {
                case "image":
                  return <ImagePreview file={currentFile} />;
                case "json":
                  return fileContent ? (
                    <JsonPreview content={fileContent} />
                  ) : (
                    <div className="text-slate-400">Loading JSON...</div>
                  );
                case "python":
                  return fileContent ? (
                    <PythonPreview content={fileContent} />
                  ) : (
                    <div className="text-slate-400">Loading Python file...</div>
                  );
                case "text":
                  return fileContent ? (
                    <TextPreview content={fileContent} />
                  ) : (
                    <div className="text-slate-400">Loading text file...</div>
                  );
                case "unsupported":
                  return <NoPreview mimetype={currentFile.mimetype} />;
                default:
                  return (
                    <div className="text-slate-400">Unknown file type</div>
                  );
              }
            })()
          )}
        </div>
      </div>
    </section>
  );
};

export default AppCodePreview;
