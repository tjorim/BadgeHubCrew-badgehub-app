import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppCodePreview from "./AppCodePreview";
import { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails";

// Mock the API client
vi.mock("@api/tsRestClient.ts", () => ({
  publicTsRestClient: {
    getLatestPublishedFile: vi.fn()
  }
}));

const mockProject: ProjectDetails = {
  project_id: "test-id",
  slug: "test-project",
  name: "Test Project",
  author_name: "Test Author",
  author_id: "author-id",
  description: "Test description",
  version: {
    version_id: "v1",
    version_number: "1.0.0",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    status: "published",
    files: [
      {
        dir: "",
        name: "test",
        ext: "json",
        mimetype: "application/json",
        size_of_content: 100,
        sha256: "a".repeat(64),
        size_formatted: "100 B",
        full_path: "test.json",
        url: "http://example.com/test.json",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        dir: "",
        name: "example",
        ext: "py",
        mimetype: "text/x-python",
        size_of_content: 200,
        sha256: "b".repeat(64),
        size_formatted: "200 B",
        full_path: "example.py",
        url: "http://example.com/example.py",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        dir: "",
        name: "image",
        ext: "png",
        mimetype: "image/png",
        image_width: 100,
        image_height: 50,
        size_of_content: 1024,
        sha256: "c".repeat(64),
        size_formatted: "1 KB",
        full_path: "image.png",
        url: "http://example.com/image.png",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        dir: "",
        name: "document",
        ext: "pdf",
        mimetype: "application/pdf",
        size_of_content: 5000,
        sha256: "d".repeat(64),
        size_formatted: "5 KB",
        full_path: "document.pdf",
        url: "http://example.com/document.pdf",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  },
  tags: [],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z"
};

describe("AppCodePreview", () => {
  it("renders the component with file list", () => {
    render(<AppCodePreview project={mockProject} />);
    
    expect(screen.getByText("Code Preview / Files")).toBeInTheDocument();
    expect(screen.getByText("Project Files:")).toBeInTheDocument();
    expect(screen.getByText("test.json")).toBeInTheDocument();
    expect(screen.getByText("example.py")).toBeInTheDocument();
    expect(screen.getByText("image.png")).toBeInTheDocument();
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("shows no preview message for unsupported file types", async () => {
    render(<AppCodePreview project={mockProject} />);
    
    // Click on PDF file
    const pdfButton = screen.getByText("document.pdf");
    pdfButton.click();
    
    // Should show unsupported message
    expect(await screen.findByText("Preview not available for this file type.")).toBeInTheDocument();
    expect(screen.getByText("MIME type: application/pdf")).toBeInTheDocument();
  });

  it("shows image preview for image files", async () => {
    render(<AppCodePreview project={mockProject} />);
    
    // Click on image file
    const imageButton = screen.getByText("image.png");
    imageButton.click();
    
    // Should show image preview
    expect(await screen.findByText("Image file (100×50)")).toBeInTheDocument();
    const img = screen.getByAltText("image.png");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "http://example.com/image.png");
  });
});