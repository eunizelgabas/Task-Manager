import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Users, CheckSquare, FolderOpen, TrendingUp } from 'lucide-react';
import StatsCard from '@/Components/StatsCard';
import DataTable from '@/Components/DataTable';

export default function Dashboard({ auth, stats }) {
    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'Created new project', time: '2 hours ago' },
        { id: 2, user: 'Jane Smith', action: 'Completed task', time: '4 hours ago' },
        { id: 3, user: 'Mike Johnson', action: 'Updated user profile', time: '6 hours ago' },
        { id: 4, user: 'Sarah Wilson', action: 'Added new team member', time: '1 day ago' },
    ];

    const activityColumns = [
        { key: 'user', header: 'User' },
        { key: 'action', header: 'Action' },
        { key: 'time', header: 'Time' }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Users"
                        value={stats?.users || "1,234"}
                        icon={Users}
                        color="blue"
                        trend="+12% from last month"
                    />
                    <StatsCard
                        title="Active Tasks"
                        value={stats?.tasks || "56"}
                        icon={CheckSquare}
                        color="green"
                        trend="+8% from last week"
                    />
                    <StatsCard
                        title="Projects"
                        value={stats?.projects || "12"}
                        icon={FolderOpen}
                        color="purple"
                        trend="+3 new projects"
                    />
                    <StatsCard
                        title="Growth"
                        value="89%"
                        icon={TrendingUp}
                        color="orange"
                        trend="+5% from last month"
                    />
                </div>

                {/* Recent Activities */}
                <DataTable
                    title="Recent Activities"
                    columns={activityColumns}
                    data={recentActivities}
                />
            </div>
        </AuthenticatedLayout>
    );
}
