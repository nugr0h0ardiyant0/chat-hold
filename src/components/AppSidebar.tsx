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
  ShoppingCart 
} from "lucide-react";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: BarChart3,
    description: "Overview dan Analytics"
  },
  { 
    title: "Hold Manager", 
    url: "/", 
    icon: Shield,
    description: "Kelola Nomor Hold"
  },
  { 
    title: "Customer Journey", 
    url: "/customer-journey", 
    icon: MessageSquare,
    description: "Tracking Perjalanan Pelanggan"
  },
  { 
    title: "Keluhan", 
    url: "/keluhan", 
    icon: AlertTriangle,
    description: "Manajemen Keluhan"
  },
  { 
    title: "Produk", 
    url: "/produk", 
    icon: Package,
    description: "Kelola Produk"
  },
  { 
    title: "Promo", 
    url: "/promo", 
    icon: Tag,
    description: "Manajemen Promo"
  },
  { 
    title: "Pembelian", 
    url: "/pembelian", 
    icon: ShoppingCart,
    description: "Kelola Order & Pembelian"
  },
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
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}