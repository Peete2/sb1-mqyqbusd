import React from 'react';
import { FileText, Users, FolderOpen, Eye, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import StatsCard from '../../components/admin/StatsCard';
import { dashboardApi } from '../../lib/api/dashboard';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['dashboard-stats'],
    dashboardApi.getStats
  );

  const { data: recentActivity, isLoading: activityLoading } = useQuery(
    ['recent-activity'],
    dashboardApi.getRecentActivity
  );

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    ['analytics'],
    () => dashboardApi.getAnalytics(30)
  );

  if (statsLoading || activityLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          icon={FileText}
        />
        <StatsCard
          title="Active Authors"
          value={stats?.totalAuthors || 0}
          icon={Users}
        />
        <StatsCard
          title="Categories"
          value={stats?.totalCategories || 0}
          icon={FolderOpen}
        />
        <StatsCard
          title="Total Views"
          value={stats?.totalViews || 0}
          icon={Eye}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Performance Analytics</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2" />
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Engagement</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#FFDD00"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity?.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">
                  {activity.author?.name} • {format(new Date(activity.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${
                activity.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}