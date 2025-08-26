import React, { useState } from 'react'
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatsCard from '../components/StatsCard'

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      phone: '+1 234 567 8900',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
      phone: '+1 234 567 8901',
      joinDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Manager',
      status: 'Inactive',
      phone: '+1 234 567 8902',
      joinDate: '2023-03-10'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'User',
      status: 'Active',
      phone: '+1 234 567 8903',
      joinDate: '2023-04-05'
    }
  ]

  const userColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (value) => (
        <Badge variant={value === 'Admin' ? 'destructive' : value === 'Manager' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { key: 'joinDate', header: 'Join Date' }
  ]

  const userActions = [
    {
      label: 'Edit',
      variant: 'outline',
      onClick: (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
      }
    },
    {
      label: 'Delete',
      variant: 'destructive',
      onClick: (user) => {
        console.log('Delete user:', user)
      }
    }
  ]

  const UserForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          placeholder="Enter user name"
          defaultValue={selectedUser?.name || ''}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="Enter email"
          defaultValue={selectedUser?.email || ''}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input
          placeholder="Enter phone number"
          defaultValue={selectedUser?.phone || ''}
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsModalOpen(false)}>
          {selectedUser ? 'Update' : 'Create'} User
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={users.length.toString()}
          icon={Mail}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={users.filter(u => u.status === 'Active').length.toString()}
          icon={Phone}
          color="green"
        />
        <StatsCard
          title="Admins"
          value={users.filter(u => u.role === 'Admin').length.toString()}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Users Table */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <Button onClick={() => {
          setSelectedUser(null)
          setIsModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable
        title="All Users"
        columns={userColumns}
        data={users}
        actions={userActions}
      />

      {/* User Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        description={selectedUser ? 'Update user information' : 'Create a new user account'}
      >
        <UserForm />
      </Modal>
    </div>
  )
}

export default Users
