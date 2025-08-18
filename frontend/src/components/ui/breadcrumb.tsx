import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if not provided
  const breadcrumbItems = items || generateBreadcrumbFromPath(location.pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 ? (
            <Link
              to="/app"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronRight className="h-4 w-4 mx-1" />
          )}
          
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors truncate max-w-[200px]"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[200px]" title={item.label}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

function generateBreadcrumbFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip the 'app' segment as it's handled by the home icon
    if (segment === 'app') {
      return;
    }
    
    const label = formatSegmentLabel(segment);
    const href = index === segments.length - 1 ? undefined : currentPath;
    
    breadcrumbs.push({ label, href });
  });
  
  return breadcrumbs;
}

function formatSegmentLabel(segment: string): string {
  // Convert kebab-case or snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
