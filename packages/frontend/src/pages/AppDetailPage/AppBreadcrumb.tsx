import Breadcrumb from "@sharedComponents/Breadcrumb.tsx";
import type React from "react";

const AppBreadcrumb: React.FC<{ projectName: string }> = ({ projectName }) => (
  <Breadcrumb
    items={[
      { label: "Home", to: "/" },
      { label: "Apps", to: "/#apps-grid" },
      { label: projectName },
    ]}
  />
);

export default AppBreadcrumb;
