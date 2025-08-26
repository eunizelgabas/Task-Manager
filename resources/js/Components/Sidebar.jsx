// resources/js/Components/Layout/Sidebar.jsx
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Folder,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Bell,
  Calendar,
  BarChart3,
  FileText,
  UserCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/Components/ui/tooltip';

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  const { auth, notifications = [] } = usePage().props;
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentUrl = window.location.pathname;

  // Navigation items configuration
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      badge: null,
      roles: ['Admin', 'Manager', 'Member']
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      badge: null,
      roles: ['Admin']
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Folder,
      badge: { count: 5, variant: 'default' },
      roles: ['Admin', 'Manager']
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: { count: 12, variant: 'secondary' },
      roles: ['Admin', 'Manager', 'Member']
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      badge: null,
      roles: ['Admin', 'Manager']
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      badge: null,
      roles: ['Admin', 'Manager', 'Member']
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: null,
      roles: ['Admin', 'Manager', 'Member']
    }
  ];

  const bottomNavigationItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['Admin', 'Manager', 'Member']
    }
  ];

  // Handle collapse toggle
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggleCollapse?.(newCollapsedState);

    // Save preference to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Handle mobile menu toggle
  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Load saved preference on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentUrl]);

  // Check if user has permission for a link
  const hasPermission = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(auth?.role);
  };

  // Check if link is active
  const isLinkActive = (href) => {
    if (href === '/dashboard' && currentUrl === '/dashboard') return true;
    if (href !== '/dashboard' && currentUrl.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={handleMobileToggle}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TM</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">TaskManager</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleCollapse}
              className="hidden md:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* User Profile Section */}
          {!isCollapsed && (
            <div className="px-4 py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={auth?.user?.avatar || `https://ui-avatars.com/api/?name=${auth?.user?.name}&background=3b82f6&color=fff`}
                    alt={auth?.user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {auth?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth?.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              <TooltipProvider>
                {navigationItems.map((item) => {
                  if (!hasPermission(item.roles)) return null;

                  const Icon = item.icon;
                  const isActive = isLinkActive(item.href);

                  const linkContent = (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:text-gray-900",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Icon className={("h-5 w-5", isActive && "text-blue-600")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge variant={item.badge.variant} className="ml-auto">
                              {item.badge.count}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.name} delayDuration={0}>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <Badge variant={item.badge.variant}>
                              {item.badge.count}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </TooltipProvider>
            </nav>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="border-t p-3 space-y-1">
            <TooltipProvider>
              {bottomNavigationItems.map((item) => {
                if (!hasPermission(item.roles)) return null;

                const Icon = item.icon;
                const isActive = isLinkActive(item.href);

                const linkContent = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:text-gray-900",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className={("h-5 w-5", isActive && "text-blue-600")} />
                    {!isCollapsed && <span className="flex-1">{item.name}</span>}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.name} delayDuration={0}>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return linkContent;
              })}

              <Separator className="my-2" />

              {/* Logout Button */}
              <Link
                href="/logout"
                method="post"
                as="button"
                className={(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-50",
                  isCollapsed && "justify-center"
                )}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Logout</span>}
              </Link>
            </TooltipProvider>
          </div>
        </div>
      </aside>
    </>
  );
}
