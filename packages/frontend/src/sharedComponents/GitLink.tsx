import React from "react";
import { GitHubIcon } from "./icons/GitHubIcon.tsx";
import { GitLabIcon } from "./icons/GitLabIcon.tsx";

interface GitLinkProps {
  url?: string;
  showText?: boolean;
}

function urlHasHost(url: string, GITHUB_HOSTNAME: string) {
  try {
    return new URL(url).hostname === GITHUB_HOSTNAME;
  } catch {
    return false;
  }
}

/**
 * Renders a GitHub or GitLab icon linking to the provided source code URL.
 * It returns null if the URL is not provided or not from a supported provider.
 */
const GitLink: React.FC<GitLinkProps> = ({ url, showText = false }) => {
  if (!url) {
    return null;
  }

  const GITHUB_HOSTNAME = "github.com";
  const isGitHub = urlHasHost(url, GITHUB_HOSTNAME);
  const isGitLab = urlHasHost(url, "gitlab.com");

  const GitIcon = isGitHub ? GitHubIcon : isGitLab ? GitLabIcon : null;

  if (!GitIcon) {
    return null; // Only render for supported Git providers
  }

  const providerName = isGitHub ? "GitHub" : "GitLab";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        showText
          ? "btn-secondary px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          : "text-slate-400 hover:text-white transition-colors ml-2 flex-shrink-0"
      }
      aria-label={`Source code repository on ${providerName}`}
      title={`View source code on ${providerName}`}
    >
      <GitIcon className="h-5 w-5" />
      {showText && <span className="ml-2">View Source</span>}
    </a>
  );
};

export default GitLink;
