import { ShoppingCart, Package, Users, LayoutDashboard } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Vendors", icon: Users, path: "/vendors" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-5 border-b border-sidebar-border">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <span className="text-base font-semibold text-sidebar-active">PO Manager</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-hover text-sidebar-active"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-xs text-sidebar-foreground/60">v1.0 · Mock Mode</p>
      </div>
    </aside>
  );
}
