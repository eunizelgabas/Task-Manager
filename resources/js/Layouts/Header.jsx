import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, router } from '@inertiajs/react';
import { Menu, Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { toggleSidebar } from '../store/sidebarSlice';

export default function Header({ user, header }) {
    const dispatch = useDispatch();
    const { isMobile, activeItem } = useSelector((state) => state.sidebar);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    {isMobile && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dispatch(toggleSidebar())}
                            className="md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Desktop sidebar toggle */}
                    {!isMobile && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dispatch(toggleSidebar())}
                            className="hidden md:flex"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Page title */}
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {header || activeItem || 'Dashboard'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search bar - hidden on mobile */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 w-64"
                        />
                    </div>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback>
                                        {getInitials(user?.name || 'User')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
