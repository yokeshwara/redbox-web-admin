'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/admin-layout'
import { 
  BarChart3, Users, Store, ShoppingCart, DollarSign,
  FileText, Bell, Plus, Edit2, Zap, Eye,
  CheckCircle, Activity, Flame
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from '@/lib/api/config'
import { getToken } from '@/lib/api/auth'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {

  const [dashboardData, setDashboardData] = useState<any>(null)

  const [revenueData, setRevenueData] = useState<any[]>([])
  const [topItems, setTopItems] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {

    try {

      setLoading(true)

      const token = await getToken()

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DASHBOARD_DATA}`,
        {
          headers: getAuthHeader(token),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const res = await response.json()

      console.log("Dashboard API Response:", res)

      const apiData = res?.data || {}

      setDashboardData(apiData.summary || {})

      setRevenueData(apiData.revenue_analytics || [])

      setRecentActivity(apiData.recent_activity || [])

      if (apiData.trending_items) {
        const formattedItems = apiData.trending_items.map((item: any) => ({
          name: item.name,
          views: item.views,
          orders: item.orders,
          status: item.tag?.toLowerCase() || "trending"
        }))

        setTopItems(formattedItems)
      }

    } catch (error) {

      console.error('Dashboard fetch error:', error)

      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      })

    } finally {

      setLoading(false)

    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary rounded-2xl p-6 md:p-8 text-white shadow-2xl border border-primary/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, Admin</h1>
              <p className="text-white/80 text-sm md:text-base">
                Here's what's happening with your business today
              </p>
            </div>

            <div className="hidden md:block p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Activity size={32} />
            </div>
          </div>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">

          <StatCard
            title="Branches"
            value={dashboardData?.branches || 0}
            icon={<Store size={24} />}
            trend="+"
            color="bg-gradient-to-br from-primary to-secondary"
          />

          <StatCard
            title="Franchises"
            value={dashboardData?.franchises || 0}
            icon={<Users size={24} />}
            trend="+"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />

          <StatCard
            title="Menu Items"
            value={dashboardData?.menu_items || 0}
            icon={<ShoppingCart size={24} />}
            trend="+"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />

          <StatCard
            title="Revenue"
            value={dashboardData?.revenue || 0}
            icon={<DollarSign size={24} />}
            trend="+"
            color="bg-gradient-to-br from-amber-500 to-yellow-600"
          />

          <StatCard
            title="Enquiries"
            value={dashboardData?.enquiries || 0}
            icon={<FileText size={24} />}
            trend="+"
            color="bg-gradient-to-br from-rose-500 to-pink-600"
          />

          <StatCard
            title="Reservations"
            value={dashboardData?.reservations || 0}
            icon={<Users size={24} />}
            trend="+"
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
          />

        </div>


        {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Revenue Chart - Glassmorphism */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white to-primary/5 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" />
                  Revenue Analytics
                </h3>
                <p className="text-sm text-gray-600 mt-1">Last 6 months performance</p>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg text-primary text-xs font-bold">
                ↑ 12.5%
              </div>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 84% 54%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0 84% 54%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#999999" />
                  <YAxis stroke="#999999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '2px solid hsl(0 84% 54%)', borderRadius: '8px' }}
                    labelStyle={{ color: '#000000' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(0 84% 54%)" 
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    dot={{ fill: 'hsl(0 84% 54%)', r: 6 }}
                    activeDot={{ r: 8 }}
                    name="Revenue (₹)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity - Glassmorphism */}
          <div className="bg-gradient-to-br from-white to-primary/5 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Bell size={20} className="text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { icon: Plus, title: 'New Branch Added', time: '2 hours ago', color: 'text-blue-600' },
                { icon: Edit2, title: 'Menu Updated', time: '4 hours ago', color: 'text-purple-600' },
                { icon: CheckCircle, title: 'Franchise Approved', time: '1 day ago', color: 'text-green-600' },
                { icon: Users, title: 'Staff Added', time: '2 days ago', color: 'text-orange-600' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-primary/20 last:border-0">
                  <div className={`p-2 rounded-lg bg-primary/10 ${activity.color}`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Trending Items */}
        <div className="bg-gradient-to-br from-white to-primary/5 border-2 border-primary/30 rounded-2xl p-6 shadow-xl">

          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Flame size={20} className="text-primary" />
            Trending Items
          </h3>

          <div className="space-y-3">

            {topItems.map((item, idx) => (

              <div key={idx} className="p-4 rounded-xl border border-primary/20">

                <div className="flex justify-between">

                  <p className="font-bold text-gray-900">{item.name}</p>

                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    {item.status}
                  </span>

                </div>

                <div className="flex gap-4 mt-2 text-xs text-gray-600">

                  <span className="flex items-center gap-1">
                    <Eye size={14}/> {item.views} views
                  </span>

                  <span className="flex items-center gap-1">
                    <ShoppingCart size={14}/> {item.orders} orders
                  </span>

                </div>

              </div>

            ))}

          </div>
        </div>


        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-2xl p-6 md:p-8 shadow-2xl">

          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={24} />
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <Link href="/admin/branches">
              <QuickActionButton icon={<Plus size={20}/>} title="Add Branch" description="Create new restaurant branch"/>
            </Link>

            <Link href="/admin/menu">
              <QuickActionButton icon={<ShoppingCart size={20}/>} title="Update Menu" description="Manage menu items"/>
            </Link>

            <Link href="/admin/franchises">
              <QuickActionButton icon={<FileText size={20}/>} title="Franchises" description="Manage enquiries"/>
            </Link>

            <Link href="/admin/users">
              <QuickActionButton icon={<Users size={20}/>} title="Manage Users" description="User roles"/>
            </Link>

          </div>

        </div>

      </div>
    </AdminLayout>
  )
}


function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-gradient-to-br from-white to-primary/5 border-2 border-primary/30 rounded-xl p-4">

      <div className="flex items-center justify-between mb-3">

        <div className={`p-2 ${color} rounded-lg text-white`}>
          {icon}
        </div>

        <span className="text-xs font-bold text-green-600">
          {trend}
        </span>

      </div>

      <p className="text-gray-600 text-xs mb-1">{title}</p>

      <h3 className="text-2xl font-bold text-gray-900">
        {value}
      </h3>

    </div>
  )
}


function QuickActionButton({ icon, title, description }: any) {

  return (
    <div className="p-4 bg-white rounded-xl text-left hover:shadow-lg transition-all cursor-pointer border border-primary/20">

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
      </div>

      <p className="font-bold text-sm">{title}</p>

      <p className="text-xs text-gray-600 mt-1">{description}</p>

    </div>
  )
}