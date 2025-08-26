import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, CheckSquare, Clock, User, FolderOpen, Edit, Trash2, PlayCircle } from 'lucide-react';
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

// Move TaskForm outside the main component to prevent re-creation
const TaskForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  processing,
  selectedTask,
  projects,
  users,
  errors,
  onCancel
}) => {
  const titleInputRef = useRef(null);

  // Only focus on mount when creating a new task
  useEffect(() => {
    if (!selectedTask && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
    }
  }, []); // Empty dependency array - only runs on mount

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          ref={titleInputRef}
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        <div>
          <Label htmlFor="project_id">Project</Label>
          <Select
            value={formData.project_id?.toString() || ''}
            onValueChange={(value) => handleInputChange('project_id', parseInt(value))}
          >
            <SelectTrigger className={errors.project_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.project_id && <p className="text-red-500 text-sm mt-1">{errors.project_id}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="assigned_to">Assign to User</Label>
        <Select
          value={formData.assigned_to?.toString() || ''}
          onValueChange={(value) => {
            // Handle the "no_assignment" case
            if (value === 'no_assignment') {
              handleInputChange('assigned_to', null);
            } else {
              handleInputChange('assigned_to', parseInt(value));
            }
          }}
        >
          <SelectTrigger className={errors.assigned_to ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select user (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_assignment">No assignment</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
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
          {processing ? 'Saving...' : (selectedTask ? 'Update Task' : 'Create Task')}
        </Button>
      </div>
    </form>
  );
};

const Tasks = () => {
  // Get all props from usePage
  const { tasks = [], projects = [], users = [], auth, flash = {}, errors = {} } = usePage().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    project_id: '',
    assigned_to: '',
  });

  const taskColumns = [
    {
      key: 'title',
      header: 'Task',
      render: (value, row) => {
        const title = value || 'Untitled Task';
        const description = row?.description || 'No description';

        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">
              {description.length > 80 ? `${description.substring(0, 80)}...` : description}
            </div>
          </div>
        );
      }
    },
    {
      key: 'project',
      header: 'Project',
      render: (value, row) => {
        const project = row?.project;
        if (!project) return <span className="text-gray-400">No project</span>;

        return (
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-gray-900">{project.name}</span>
          </div>
        );
      }
    },
    {
  key: 'status',
  header: 'Status',
  render: (value) => {
    const statusColors = {
      'To Do': 'secondary',
      'In Progress': 'default',
      'Done': 'primary'
    };
    return (
      <Badge variant={statusColors[value] || 'secondary'}>
        {value}
      </Badge>
    );
  }
},
    {
      key: 'assignee',
      header: 'Assigned To',
      render: (value, row) => {
        const assignee = row?.assignee;
        if (!assignee) return <span className="text-gray-400">Unassigned</span>;

        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {assignee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{assignee.name}</div>
              <div className="text-sm text-gray-500">Assignee</div>
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

  const taskActions = [
    {
      label: 'Edit',
      variant: 'outline',
      onClick: (task) => {
        setSelectedTask(task);
        setFormData({
          title: task?.title || '',
          description: task?.description || '',
          status: task?.status || 'to_do',
          project_id: task?.project_id || '',
          assigned_to: task?.assigned_to || '',
        });
        setIsModalOpen(true);
      }
    },
    {
      label: 'Delete',
      variant: 'destructive',
      onClick: (task) => {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
          router.delete(`/tasks/${task.id}`, {
            onSuccess: () => {
              console.log('Task deleted successfully');
            },
            onError: (errors) => {
              console.error('Delete failed:', errors);
            }
          });
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
      if (selectedTask) {
        // Update task
        router.put(`/tasks/${selectedTask.id}`, formData, {
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
        // Create task
        router.post('/tasks', formData, {
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
  }, [formData, selectedTask]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      status: 'to_do',
      project_id: '',
      assigned_to: '',
    });
    setSelectedTask(null);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  // Calculate stats from actual tasks data
  const totalTasks = tasks?.length || 0;
  const toDoTasks = tasks?.filter(t => t?.status === 'To Do')?.length || 0;
  const inProgressTasks = tasks?.filter(t => t?.status === 'In Progress')?.length || 0;
  const doneTasks = tasks?.filter(t => t?.status === 'Done')?.length || 0;

  return (
    <AuthenticatedLayout user={auth.user} header="Tasks">
      <Head title="Tasks" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={totalTasks.toString()}
            icon={CheckSquare}
            color="blue"
            trend={`${projects.length} projects`}
          />
          <StatsCard
            title="To Do"
            value={toDoTasks.toString()}
            icon={Clock}
            color="yellow"
            trend="Pending tasks"
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks.toString()}
            icon={PlayCircle}
            color="blue"
            trend="Active tasks"
          />
          <StatsCard
            title="Done"
            value={doneTasks.toString()}
            icon={CheckSquare}
            color="green"
            trend="Completed tasks"
          />
        </div>

        {/* Tasks Table */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tasks Management</h2>
          <Button onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {tasks.length > 0 ? (
          <DataTable
            title="All Tasks"
            columns={taskColumns}
            data={tasks}
            actions={taskActions}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </div>
        )}

        {/* Task Modal */}
        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={selectedTask ? 'Edit Task' : 'Add New Task'}
          description={selectedTask ? 'Update task information' : 'Create a new task'}
          trapFocus={false}
        >
          <TaskForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            processing={processing}
            selectedTask={selectedTask}
            projects={projects}
            users={users}
            errors={errors}
            onCancel={handleCancel}
          />
        </Modal>
      </div>
    </AuthenticatedLayout>
  );
};

export default Tasks;
