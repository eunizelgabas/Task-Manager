import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import DataTable from '@/Components/DataTable';
import Modal from '@/Components/Modal';
import StatsCard from '@/Components/StatsCard';
import FlashMessage from '@/Components/FlashMessage';

export default function Users({ auth, users = [], roles = [], stats = {}, flash = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roles: [], // Changed to array for multiple roles
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);
     const { errors } = usePage().props;
    const userColumns = [
        {
            key: 'name',
            header: 'Name',
            render: (value, row) => {
                const name = value || 'Unknown';
                const email = row?.email || 'No email';
                const initial = name.charAt(0).toUpperCase();

                return (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {initial}
                        </div>
                        <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-sm text-gray-500">{email}</div>
                        </div>
                    </div>
                );
            }
        },

        {
            key: 'roles',
            header: 'Roles',
            render: (value, row) => {
                const userRoles = row?.roles || [];
                if (userRoles.length === 0) {
                    return <Badge variant="secondary">No Role</Badge>;
                }

                return (
                    <div className="flex flex-wrap gap-1">
                        {userRoles.map((role, index) => {
                            const colors = {
                                Admin: 'destructive',
                                Manager: 'default',
                                Member: 'secondary',
                            };
                            return (
                                <Badge key={index} variant={colors[role.name] || 'secondary'}>
                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                </Badge>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            header: 'Join Date',
            render: (value) => {
                if (!value) return 'N/A';
                try {
                    return new Date(value).toLocaleDateString();
                } catch (error) {
                    return 'Invalid Date';
                }
            }
        }
    ];

    const userActions = [
        {
            label: 'Edit',
            variant: 'outline',
            onClick: (user) => {
                setSelectedUser(user);
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    roles: user?.roles?.map(role => role.name) || [],
                    password: '', // Always empty for security
                    password_confirmation: '', // Always empty for security
                });
                setIsModalOpen(true);
            }
        },
        {
            label: 'Delete',
            variant: 'destructive',
            onClick: (user) => {
                if (user.id === auth.user.id) {
                    alert('You cannot delete your own account!');
                    return;
                }

                if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                    handleDeleteUser(user.id);
                }
            }
        }
    ];

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (selectedUser) {
                // Update user
                router.put(`/users/${selectedUser.id}`, formData, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Update failed:', errors);
                        alert('Failed to update user. Please check the form.');
                    },
                    onFinish: () => setProcessing(false)
                });
            } else {
                // Create user
                router.post('/users', formData, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Creation failed:', errors);
                        alert('Failed to create user. Please check the form.');
                    },
                    onFinish: () => setProcessing(false)
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setProcessing(false);
        }
    };

    // Handle user deletion
    const handleDeleteUser = (userId) => {
        router.delete(`/users/${userId}`, {
            onSuccess: () => {
                console.log('User deleted successfully');
            },
            onError: (errors) => {
                console.error('Delete failed:', errors);
                alert('Failed to delete user.');
            }
        });
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            roles: [],
        });
        setSelectedUser(null);
    };

    const UserForm = () => (

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    placeholder="Enter user name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                />
            </div>

            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />

            </div>

            <div className="gap-4">
                <div>
                    <Label htmlFor="roles">Roles</Label>
                    <Select
                        value={formData.roles[0] || ''}
                        onValueChange={(value) => handleInputChange('roles', [value])}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             {/*Password field for new users */}
            {!selectedUser && (
                <>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            placeholder="Confirm password"
                            value={formData.password_confirmation}
                            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                            required
                            className={errors.password_confirmation ? 'border-red-500' : ''}
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                    </div>
                </>
            )}

             {/* Show password reset option when editing */}
            {selectedUser && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Leave password fields empty to keep the current password, or fill them to change the password.
                    </p>
                    <div className="mt-3 space-y-3">
                        <div>
                            <Label htmlFor="password">New Password (optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password (leave empty to keep current)"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        {formData.password && (
                            <div>
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                    required
                                    className={errors.password_confirmation ? 'border-red-500' : ''}
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                    }}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : (selectedUser ? 'Update User' : 'Create User')}
                </Button>
            </div>
        </form>
    );

    // Calculate stats from actual users data
    const totalUsers = users?.length || 0;
   const adminUsers = users?.filter(u => u?.roles?.some(role => role.name === 'Admin'))?.length || 0;
    return (
        <AuthenticatedLayout user={auth.user} header="Users">
            <Head title="Users" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {/* Enhanced Flash Messages */}
                {flash?.success && (
                    <FlashMessage
                        type="success"
                        message={flash.success}
                        onClose={() => {
                            // Optional: Clear flash message from Inertia
                            router.reload({ only: ['flash'] });
                        }}
                    />
                )}
                {flash?.error && (
                    <FlashMessage
                        type="error"
                        message={flash.error}
                        onClose={() => {
                            router.reload({ only: ['flash'] });
                        }}
                    />
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Users"
                        value={stats?.total?.toString() || totalUsers.toString()}
                        icon={Mail}
                        color="blue"
                    />

                    <StatsCard
                        title="Administrators"
                        value={stats?.admins?.toString() || adminUsers.toString()}
                        icon={Eye}
                        color="purple"
                        trend="System admins"
                    />
                </div>


                {/* Users Table */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Users Management</h2>
                    <Button onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>

                {users.length > 0 ? (
                    <DataTable
                        title="All Users"
                        columns={userColumns}
                        data={users}
                        actions={userActions}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No users found. Create your first user!</p>
                    </div>
                )}

                {/* User Modal */}
                <Modal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    title={selectedUser ? 'Edit User' : 'Add New User'}
                    description={selectedUser ? 'Update user information' : 'Create a new user account'}
                    trapFocus={false}
                >
                  {UserForm()}
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
