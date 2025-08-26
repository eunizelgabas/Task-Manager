import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import {
  toggleSidebar,
  closeSidebar,
  setActiveItem,
  setIsMobile
} from '../store/sidebarSlice';

export default function Sidebar({ user }) {
  const dispatch = useDispatch();
  const { url } = usePage();
  const { isOpen, activeItem, isMobile } = useSelector((state) => state.sidebar);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      name: 'Users',
      icon: Users,
      href: '/users'
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      href: '/tasks'
    },
    {
      name: 'Projects',
      icon: FolderOpen,
      href: '/projects'
    }
  ];

  // Update active item based on current route
  useEffect(() => {
    const currentItem = menuItems.find(item => url.startsWith(item.href));
    if (currentItem) {
      dispatch(setActiveItem(currentItem.name));
    }
  }, [url, dispatch]);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  const isActiveRoute = (item) => {
    return url.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(closeSidebar())}
            className="text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => {
                    dispatch(setActiveItem(item.name));
                    if (isMobile) {
                      dispatch(closeSidebar());
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={() => dispatch(toggleSidebar())}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:block`}
    >
      <div className="w-64 h-full">
        <SidebarContent />
      </div>
    </div>
  );
}
