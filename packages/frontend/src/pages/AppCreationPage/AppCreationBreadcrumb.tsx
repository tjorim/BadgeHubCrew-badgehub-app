import Breadcrumb from "@sharedComponents/Breadcrumb.tsx";
import type React from "react";

const AppCreationBreadcrumb: React.FC = () => (
  <Breadcrumb
    items={[{ label: "Home", to: "/" }, { label: "Create New App" }]}
  />
);

export default AppCreationBreadcrumb;
