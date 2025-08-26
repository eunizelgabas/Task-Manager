import React, { useState } from 'react'
import { Plus, Folder, Users, Calendar, BarChart3, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatsCard from '../components/StatsCard'

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Modern e-commerce platform with React and Laravel backend',
      manager: 'John Doe',
      status: 'Active',
      priority: 'High',
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: '$50,000',
      teamSize: 8,
      client: 'Tech Corp'
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication',
      manager: 'Jane Smith',
      status: 'Active',
      priority: 'Critical',
      progress: 45,
      startDate: '2024-02-15',
      endDate: '2024-08-15',
      budget: '$120,000',
      teamSize: 12,
      client: 'First Bank'
    },
    {
      id: 3,
      name: 'CRM System',
      description: 'Customer relationship management system for sales teams',
      manager: 'Mike Johnson',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      budget: '$75,000',
      teamSize: 6,
      client: 'Sales Pro Inc'
    },
    {
      id: 4,
      name: 'Learning Management System',
      description: 'Online learning platform with video streaming and assessments',
      manager: 'Sarah Wilson',
      status: 'On Hold',
      priority: 'Low',
      progress: 25,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      budget: '$90,000',
      teamSize: 10,
      client: 'EduTech Solutions'
    },
    {
      id: 5,
      name: 'Inventory Management',
      description: 'Real-time inventory tracking and management system',
      manager: 'David Brown',
      status: 'Active',
      priority: 'Medium',
      progress: 60,
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      budget: '$35,000',
      teamSize: 5,
      client: 'Warehouse Co'
    }
  ]

  const projectColumns = [
    {
      key: 'name',
      header: 'Project Name',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{row.description}</div>
        </div>
      )
    },
    { key: 'manager', header: 'Manager' },
    { key: 'client', header: 'Client' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const colors = {
          'Active': 'default',
          'Completed': 'default',
          'On Hold': 'secondary',
          'Cancelled': 'destructive'
        }
        return <Badge variant={colors[value] || 'secondary'}>{value}</Badge>
      }
    },
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
      key: 'progress',
      header: 'Progress',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      )
    },
    { key: 'budget', header: 'Budget' },
    { key: 'endDate', header: 'Due Date' }
  ]

  const projectActions = [
    {
      label: 'View',
      variant: 'outline',
      onClick: (project) => {
        console.log('View project:', project)
      }
    },
    {
      label: 'Edit',
      variant: 'outline',
      onClick: (project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
      }
    },
    {
      label: 'Delete',
      variant: 'destructive',
      onClick: (project) => {
        console.log('Delete project:', project)
      }
    }
  ]

  const ProjectForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="Enter project name"
            defaultValue={selectedProject?.name || ''}
          />
        </div>
        <div>
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            placeholder="Enter client name"
            defaultValue={selectedProject?.client || ''}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter project description"
          defaultValue={selectedProject?.description || ''}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manager">Project Manager</Label>
          <Input
            id="manager"
            placeholder="Assign project manager"
            defaultValue={selectedProject?.manager || ''}
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            placeholder="Enter budget (e.g., $50,000)"
            defaultValue={selectedProject?.budget || ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={selectedProject?.status || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select defaultValue={selectedProject?.priority || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            placeholder="Number of team members"
            defaultValue={selectedProject?.teamSize || ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            defaultValue={selectedProject?.startDate || ''}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            defaultValue={selectedProject?.endDate || ''}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsModalOpen(false)}>
          {selectedProject ? 'Update' : 'Create'} Project
        </Button>
      </div>
    </div>
  )

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'Active').length
  const completedProjects = projects.filter(p => p.status === 'Completed').length
  const totalBudget = projects.reduce((sum, p) => {
    const budget = parseInt(p.budget.replace(/[$,]/g, ''))
    return sum + budget
  }, 0)
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={projects.length.toString()}
          icon={Folder}
          color="blue"
          trend={`${activeProjects} active`}
        />
        <StatsCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={BarChart3}
          color="green"
          trend={`${completedProjects} completed`}
        />
        <StatsCard
          title="Total Budget"
          value={`$${(totalBudget / 1000).toFixed(0)}K`}
          icon={Calendar}
          color="purple"
          trend="Across all projects"
        />
        <StatsCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          icon={Users}
          color="orange"
          trend="Overall completion"
        />
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.slice(0, 3).map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 pt-2">
                  <span>Manager: {project.manager}</span>
                  <span>{project.budget}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Table */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <Button onClick={() => {
          setSelectedProject(null)
          setIsModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <DataTable
        title="All Projects"
        columns={projectColumns}
        data={projects}
        actions={projectActions}
      />

      {/* Project Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedProject ? 'Edit Project' : 'Add New Project'}
        description={selectedProject ? 'Update project information' : 'Create a new project'}
        size="xl"
      >
        <ProjectForm />
      </Modal>
    </div>
  )
}

export default Projects
