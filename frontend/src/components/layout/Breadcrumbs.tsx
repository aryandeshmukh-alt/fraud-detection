import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  paths.forEach((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const label = path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Last item doesn't have href
    if (index === paths.length - 1) {
      breadcrumbs.push({ label });
    } else {
      breadcrumbs.push({ label, href });
    }
  });

  return breadcrumbs;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        to="/dashboard"
        className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-surface-300 dark:text-surface-600" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-surface-900 dark:text-surface-100">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
