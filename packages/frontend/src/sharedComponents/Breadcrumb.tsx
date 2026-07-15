import type React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav className="mb-6 text-sm" aria-label="Breadcrumb">
    <div className="breadcrumbs">
      <ul>
        {items.map((item) => (
          <li key={`${item.label}-${item.to ?? "current"}`}>
            {item.to ? (
              <Link to={item.to} className="text-primary hover:text-primary/80">
                {item.label}
              </Link>
            ) : (
              <span className="opacity-60">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default Breadcrumb;
