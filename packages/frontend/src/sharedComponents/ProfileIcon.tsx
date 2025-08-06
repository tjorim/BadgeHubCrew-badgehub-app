import React, { useEffect, useRef, useState } from "react";

import { useSession } from "@sharedComponents/keycloakSession/SessionContext.tsx";

// --- ProfileIcon ---
const ProfileIcon: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, keycloak } = useSession();

  async function login() {
    await keycloak?.login();
  }

  async function logout() {
    await keycloak?.logout();
  }

  function forgotPassword() {
    if (!keycloak) return;

    // Redirect to Keycloak's password reset page
    const resetPasswordUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/login-actions/reset-credentials?client_id=${keycloak.clientId}`;
    window.location.href = resetPasswordUrl;
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="inline-block align-top p-2 pr-3">{user?.name}</div>
      <button
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
        aria-label="Profile"
        onClick={() => setMenuOpen((v) => !v)}
        data-testid="profile-icon"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>
      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 border border-gray-700 rounded-md shadow-lg py-2 z-50"
          style={{ backgroundColor: "#1f2937" }}
        >
          {user ? (
            <div className="px-4 py-2 text-gray-200 text-sm">
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-400 text-xs">{user.email}</div>
              <button
                className="bg-gray-700 text-left px-4 py-2 text-gray-200 hover:bg-gray-600 rounded-md text-sm transition-colors mx-2 mt-2"
                style={{ width: "calc(100% - 1rem)" }}
                onClick={logout}
                data-testid="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                className="bg-gray-700 text-left px-4 py-2 text-gray-200 hover:bg-gray-600 rounded-md text-sm transition-colors mx-2 mb-2"
                style={{ width: "calc(100% - 1rem)" }}
                onClick={login}
                data-testid="login-button"
              >
                Login / Register
              </button>
              <button
                className="bg-gray-600 text-left px-4 py-2 text-gray-300 hover:bg-gray-500 rounded-md text-sm transition-colors mx-2"
                style={{ width: "calc(100% - 1rem)" }}
                onClick={forgotPassword}
                data-testid="forgot-password-button"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
