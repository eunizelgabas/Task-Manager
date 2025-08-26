import React, { useState } from 'react'
import { Plus, Calendar, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatsCard from '../components/StatsCard'

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const tasks = [
    {
      id: 1,
      title: 'Update user dashboard',
      description: 'Redesign the user dashboard with new components',
      assignee: 'John Doe',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2024-01-15',
      project: 'Web App'
    },
    {
      id: 2,
      title: 'Fix login bug',
      description: 'Resolve authentication issues on mobile',
      assignee: 'Jane Smith',
      priority: 'Critical',
      status: 'Open',
      dueDate: '2024-01-10',
      project: 'Mobile App'
    },
    {
      id: 3,
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      assignee: 'Mike Johnson',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2024-01-08',
      project: 'Backend'
    },
    {
      id: 4,
      title: 'User testing',
      description: 'Conduct user testing for new features',
      assignee: 'Sarah Wilson',
      priority: 'Low',
      status: 'Open',
      dueDate: '2024-01-20',
      project: 'Research'
    }
  ]

  const taskColumns = [
    { key: 'title', header: 'Task' },
    { key: 'assignee', header: 'Assignee' },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => {
        const colors = {
          Critical: 'destructive',
          High: 'default',
          Medium: 'secondary',
          Low: 'outline'
        }
        return <Badge variant={colors[value]}>{value}</Badge>
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const colors = {
          'Open': 'secondary',
          'In Progress': 'default',
          'Completed': 'default'
        }
        return <Badge variant={colors[value]}>{value}</Badge>
      }
    },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'project', header: 'Project' }
  ]

  const taskActions = [
    {
      label: 'Edit',
      variant: 'outline',
      onClick: (task) => {
        setSelectedTask(task)
        setIsModalOpen(true)
      }
    },
    {
      label: 'Delete',
      variant: 'destructive',
      onClick: (task) => {
        console.log('Delete task:', task)
      }
    }
  ]

  const TaskForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          placeholder="Enter task title"
          defaultValue={selectedTask?.title || ''}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Enter task description"
          defaultValue={selectedTask?.description || ''}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Assignee</label>
          <Input
            placeholder="Assign to"
            defaultValue={selectedTask?.assignee || ''}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Input
            type="date"
            defaultValue={selectedTask?.dueDate || ''}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsModalOpen(false)}>
          {selectedTask ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={tasks.length.toString()}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="In Progress"
          value={tasks.filter(t => t.status === 'In Progress').length.toString()}
          icon={User}
          color="orange"
        />
        <StatsCard
          title="Completed"
          value={tasks.filter(t => t.status === 'Completed').length.toString()}
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Critical"
          value={tasks.filter(t => t.priority === 'Critical').length.toString()}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Tasks Table */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Button onClick={() => {
          setSelectedTask(null)
          setIsModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DataTable
        title="All Tasks"
        columns={taskColumns}
        data={tasks}
        actions={taskActions}
      />

      {/* Task Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedTask ? 'Edit Task' : 'Add New Task'}
        description={selectedTask ? 'Update task information' : 'Create a new task'}
        size="lg"
      >
        <TaskForm />
      </Modal>
    </div>
  )
}

export default Tasks
