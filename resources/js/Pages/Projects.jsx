import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, FolderOpen, Users, Edit, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import DataTable from '@/Components/DataTable';
import Modal from '@/Components/Modal';
import StatsCard from '@/Components/StatsCard';
import FlashMessage from '@/Components/FlashMessage';

const ProjectForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    processing,
    selectedProject,
    users,
    errors,
    onCancel
}) => {
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (nameInputRef.current) {
            setTimeout(() => {
                nameInputRef.current.focus();
            }, 100);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Show validation errors */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    <p className="font-medium">Please fix the following errors:</p>
                    <ul className="mt-1 list-disc list-inside text-sm">
                        {Object.entries(errors).map(([field, messages]) => (
                            <li key={field}>
                                {Array.isArray(messages) ? messages[0] : messages}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <Label htmlFor="name">Project name</Label>
                <Input
                    id="name"
                    ref={nameInputRef}
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
                <Label htmlFor="manager_id">Project Manager</Label>
                <Select
                    value={formData.manager_id?.toString() || ''}
                    onValueChange={(value) => handleInputChange('manager_id', parseInt(value))}
                >
                    <SelectTrigger className={errors.manager_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select project manager" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.manager_id && <p className="text-red-500 text-sm mt-1">{errors.manager_id}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : (selectedProject ? 'Update Project' : 'Create Project')}
                </Button>
            </div>
        </form>
    );
};

export default function Projects({ auth, projects = [], users = [], stats = {}, flash = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        manager_id: '',
    });
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const projectColumns = [
        {
            key: 'name',
            header: 'Project name',
            render: (value, row) => {
                const name = value || 'Unnamed Project';
                const description = row?.description || 'No description';

                return (
                    <div className="space-y-1">
                        <div className="font-medium text-gray-900">{name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'manager',
            header: 'Project Manager',
            render: (value, row) => {
                const manager = row?.manager;
                if (!manager) return <span className="text-gray-400">No manager assigned</span>;

                return (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {manager.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{manager.name}</div>
                            <div className="text-sm text-gray-500">Manager</div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            header: 'Created Date',
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

    const projectActions = [
        {
            label: 'Edit',
            variant: 'outline',
            onClick: (project) => {
                setSelectedProject(project);
                setFormData({
                    name: project?.name || '',
                    description: project?.description || '',
                    manager_id: project?.manager_id || '',
                });
                setIsModalOpen(true);
            }
        },
        {
            label: 'Delete',
            variant: 'destructive',
            onClick: (project) => {
                if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                    handleDeleteProject(project.id);
                }
            }
        }
    ];

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (selectedProject) {
                // Update project
                router.put(`/projects/${selectedProject.id}`, formData, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Update failed:', errors);
                    },
                    onFinish: () => setProcessing(false)
                });
            } else {
                // Create project
                router.post('/projects', formData, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Creation failed:', errors);
                    },
                    onFinish: () => setProcessing(false)
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setProcessing(false);
        }
    }, [formData, selectedProject]);

    const handleDeleteProject = useCallback((projectId) => {
        router.delete(`/projects/${projectId}`, {
            onSuccess: () => {
                console.log('Project deleted successfully');
            },
            onError: (errors) => {
                console.error('Delete failed:', errors);
            }
        });
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            description: '',
            manager_id: '',
        });
        setSelectedProject(null);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, [resetForm]);

    return (
        <AuthenticatedLayout user={auth.user} header="Projects">
            <Head name="Projects" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <FlashMessage
                        type="success"
                        message={flash.success}
                        onClose={() => router.reload({ only: ['flash'] })}
                    />
                )}
                {flash?.error && (
                    <FlashMessage
                        type="error"
                        message={flash.error}
                        onClose={() => router.reload({ only: ['flash'] })}
                    />
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Projects"
                        value={projects.length.toString()}
                        icon={FolderOpen}
                        color="blue"
                    />
                    <StatsCard
                        title="Project Managers"
                        value={users.length.toString()}
                        icon={Users}
                        color="green"
                    />
                </div>

                {/* Projects Table */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Projects Management</h2>
                    <Button onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                    </Button>
                </div>

                {projects.length > 0 ? (
                    <DataTable
                        name="All Projects"
                        columns={projectColumns}
                        data={projects}
                        actions={projectActions}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No projects found. Create your first project!</p>
                    </div>
                )}

                {/* Project Modal */}
                <Modal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    name={selectedProject ? 'Edit Project' : 'Add New Project'}
                    description={selectedProject ? 'Update project information' : 'Create a new project'}
                    trapFocus={false}
                >
                    <ProjectForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        selectedProject={selectedProject}
                        users={users}
                        errors={errors}
                        onCancel={handleCancel}
                    />
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
