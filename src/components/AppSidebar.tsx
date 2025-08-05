import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  Shield, 
  MessageSquare, 
  AlertTriangle, 
  Package, 
  Tag, 
  ShoppingCart,
  Activity
} from "lucide-react";

const menuGroups = [
  {
    label: "ANALYTICS",
    items: [
      { 
        title: "Dashboard", 
        url: "/dashboard", 
        icon: BarChart3
      },
      { 
        title: "Token Usage", 
        url: "/token-usage", 
        icon: Activity
      },
    ]
  },
  {
    label: "MANAGEMENT",
    items: [
      { 
        title: "Hold Manager", 
        url: "/", 
        icon: Shield
      },
      { 
        title: "Customer Journey", 
        url: "/customer-journey", 
        icon: MessageSquare
      },
      { 
        title: "Keluhan", 
        url: "/keluhan", 
        icon: AlertTriangle
      },
    ]
  },
  {
    label: "COMMERCE",
    items: [
      { 
        title: "Produk", 
        url: "/produk", 
        icon: Package
      },
      { 
        title: "Promo", 
        url: "/promo", 
        icon: Tag
      },
      { 
        title: "Pembelian", 
        url: "/pembelian", 
        icon: ShoppingCart
      },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground";
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">C</span>
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">Cozmeed</span>
              <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && (
                          <span className="text-sm font-medium ml-3">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}