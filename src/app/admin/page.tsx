'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  Settings,
  DollarSign,
  Bot,
  Flag,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
  X,
  BarChart3,
  Calendar,
  MessageSquare,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  Copy,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Droplets,
  Camera,
  Zap
} from 'lucide-react'

// Enhanced mock data for comprehensive admin dashboard
const dashboardStats = {
  totalUsers: 15847,
  activeUsers: 8932,
  inactiveUsers: 6915,
  newUsersToday: 47,
  newUsersThisWeek: 312,
  totalRevenue: 127540,
  monthlyRevenue: 23890,
  weeklyRevenue: 5680,
  dailyRevenue: 890,
  totalMessages: 1247893,
  todayMessages: 3421,
  weekMessages: 24567,
  totalReferrals: 3456,
  activeReferrals: 2890,
  pendingPayouts: 12,
  totalCreditsUsed: 892341,
  oceanLitersCleaned: 1247893,
  averageCreditsPerUser: 56.3,
  conversionRate: 12.4,
  churnRate: 3.2,
  lifetimeValue: 187.50
}

const recentUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@email.com',
    plan: 'Pro',
    credits: 4200,
    joined: '2025-01-08',
    status: 'active',
    lastLogin: '2025-01-09 14:30',
    totalMessages: 342,
    referrals: 5,
    earnings: '$45.20'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    plan: 'Plus',
    credits: 850,
    joined: '2025-01-08',
    status: 'active',
    lastLogin: '2025-01-09 12:15',
    totalMessages: 156,
    referrals: 3,
    earnings: '$23.10'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@email.com',
    plan: 'Free',
    credits: 45,
    joined: '2025-01-07',
    status: 'active',
    lastLogin: '2025-01-09 09:45',
    totalMessages: 89,
    referrals: 1,
    earnings: '$5.50'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@email.com',
    plan: 'Pro',
    credits: 3200,
    joined: '2025-01-07',
    status: 'suspended',
    lastLogin: '2025-01-08 16:20',
    totalMessages: 267,
    referrals: 0,
    earnings: '$0.00'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@email.com',
    plan: 'Plus',
    credits: 1200,
    joined: '2025-01-06',
    status: 'active',
    lastLogin: '2025-01-09 11:30',
    totalMessages: 203,
    referrals: 2,
    earnings: '$15.80'
  }
]

const referralData = [
  {
    id: '1',
    referrer: 'Sarah Johnson',
    referred: 'Mike Chen',
    plan: 'Plus',
    commission: '$4.50',
    status: 'active',
    date: '2025-01-08',
    level: 1,
    referrerEmail: 'sarah@email.com',
    referredEmail: 'mike@email.com'
  },
  {
    id: '2',
    referrer: 'John Smith',
    referred: 'Emma Wilson',
    plan: 'Pro',
    commission: '$6.00',
    status: 'active',
    date: '2025-01-07',
    level: 1,
    referrerEmail: 'john@email.com',
    referredEmail: 'emma@email.com'
  },
  {
    id: '3',
    referrer: 'Sarah Johnson',
    referred: 'David Brown',
    plan: 'Plus',
    commission: '$4.50',
    status: 'pending',
    date: '2025-01-06',
    level: 1,
    referrerEmail: 'sarah@email.com',
    referredEmail: 'david@email.com'
  },
  {
    id: '4',
    referrer: 'Mike Chen',
    referred: 'Alice Davis',
    plan: 'Plus',
    commission: '$1.50',
    status: 'active',
    date: '2025-01-05',
    level: 2,
    referrerEmail: 'mike@email.com',
    referredEmail: 'alice@email.com'
  },
  {
    id: '5',
    referrer: 'Emma Wilson',
    referred: 'Bob Wilson',
    plan: 'Pro',
    commission: '$4.00',
    status: 'active',
    date: '2025-01-04',
    level: 2,
    referrerEmail: 'emma@email.com',
    referredEmail: 'bob@email.com'
  }
]

const paymentSchedule = [
  {
    id: '1',
    user: 'Sarah Johnson',
    email: 'sarah@email.com',
    amount: '$45.20',
    type: 'referral',
    dueDate: '2025-01-15',
    status: 'pending',
    paypalEmail: 'sarah.paypal@email.com'
  },
  {
    id: '2',
    user: 'John Smith',
    email: 'john@email.com',
    amount: '$67.80',
    type: 'referral',
    dueDate: '2025-01-15',
    status: 'pending',
    paypalEmail: 'john.smith.paypal@email.com'
  },
  {
    id: '3',
    user: 'Mike Chen',
    email: 'mike@email.com',
    amount: '$23.40',
    type: 'referral',
    dueDate: '2025-01-20',
    status: 'scheduled',
    paypalEmail: 'mike.chen.pp@email.com'
  },
  {
    id: '4',
    user: 'Emma Wilson',
    email: 'emma@email.com',
    amount: '$89.60',
    type: 'referral',
    dueDate: '2025-01-20',
    status: 'scheduled',
    paypalEmail: 'emma.wilson.pay@email.com'
  },
  {
    id: '5',
    user: 'David Brown',
    email: 'david@email.com',
    amount: '$34.50',
    type: 'referral',
    dueDate: '2025-01-25',
    status: 'scheduled',
    paypalEmail: 'david.brown.pay@email.com'
  }
]

const chatAnalytics = [
  { persona: 'Academic', messages: 89432, usage: '18.5%', avgCredits: 12, satisfaction: 4.8 },
  { persona: 'Engineer', messages: 142876, usage: '29.3%', avgCredits: 8, satisfaction: 4.9 },
  { persona: 'Marketer', messages: 76543, usage: '15.7%', avgCredits: 10, satisfaction: 4.7 },
  { persona: 'Lawyer', messages: 65234, usage: '13.4%', avgCredits: 15, satisfaction: 4.6 },
  { persona: 'Medical', messages: 54321, usage: '11.2%', avgCredits: 18, satisfaction: 4.8 },
  { persona: 'Coach', messages: 34567, usage: '7.1%', avgCredits: 9, satisfaction: 4.5 },
  { persona: 'Business Expert', messages: 23456, usage: '4.8%', avgCredits: 14, satisfaction: 4.7 },
  { persona: 'Philosopher', messages: 12345, usage: '2.5%', avgCredits: 16, satisfaction: 4.4 }
]

// Content management data
const initialHomepageContent = {
  heroTitle: "AI That Makes a",
  heroSubtitle: "Real Difference",
  heroDescription: "Miky.ai is your professional AI assistant with specialized expertise. Get expert help while cleaning the ocean - every chat matters.",
  heroImage: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f",
  featuresTitle: "Why Choose Miky.ai?",
  featuresSubtitle: "More than just AI - we're building a better future, one chat at a time.",
  oceanTitle: "Every Message Matters",
  oceanDescription: "Through our direct donations to The Ocean Cleanup, every chat you have with Miky helps remove plastic from our oceans. AI with purpose.",
  statsLitersCleaned: "1M+",
  statsActiveUsers: "50K+",
  statsAiSpecialists: "8",
  ctaButtonText: "Start Free with 100 Credits"
}

// System settings
const initialSystemSettings = {
  maxFileSize: 20,
  defaultCredits: 100,
  referralBonusCredits: 200,
  creditPrice: 0.015,
  minimumPayout: 25,
  paypalEmail: "support@miky.ai",
  maintenanceMode: false,
  registrationEnabled: true,
  referralSystemEnabled: true,
  oceanCleanupEnabled: true
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (password: string) => void
  error?: string
}

function LoginModal({ isOpen, onClose, onLogin, error }: LoginModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-2">Enter your admin password to continue</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-600/20 border-red-600/50">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="pr-10 bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [homepageContent, setHomepageContent] = useState(initialHomepageContent)
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings)

  const handleLogin = (password: string) => {
    if (password === 'Vivagip74!') {
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setLoginError('')
    } else {
      setLoginError('Invalid password. Access denied.')
    }
  }

  const handleExportData = (type: string) => {
    console.log(`Exporting ${type} data...`)
    // Simulate export
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `miky-ai-${type}-${timestamp}.csv`
    alert(`${type} data exported successfully as ${filename}!`)
  }

  const handleRefreshData = () => {
    console.log('Refreshing data...')
    // Simulate refresh
    setTimeout(() => {
      alert('Data refreshed successfully!')
    }, 1000)
  }

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      alert('Please select items first')
      return
    }
    alert(`${action} applied to ${selectedItems.length} items`)
    setSelectedItems([])
  }

  const handleSaveContent = () => {
    alert('Homepage content saved successfully!')
  }

  const handleSaveSettings = () => {
    alert('System settings saved successfully!')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => window.location.href = '/'}
          onLogin={handleLogin}
          error={loginError}
        />
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'referrals', label: 'Referrals', icon: TrendingUp },
    { key: 'payments', label: 'Payments', icon: DollarSign },
    { key: 'analytics', label: 'Analytics', icon: MessageSquare },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Enhanced Header */}
      <header className="border-b border-gray-800 p-4 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
              <Shield className="w-3 h-3 mr-1" />
              Admin Dashboard
            </Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleRefreshData}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('/', '_blank')}
              className="text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsLoggedIn(false)
                setShowLoginModal(true)
              }}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                } whitespace-nowrap transition-all duration-200`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Overview Tab - Enhanced */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Platform Overview</h2>
                <p className="text-gray-400">Real-time analytics and key metrics</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportData('overview')} variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </div>
            </div>

            {/* Enhanced Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{dashboardStats.totalUsers.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+{dashboardStats.newUsersToday} today</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+${dashboardStats.dailyRevenue} today</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Messages Today</p>
                      <p className="text-2xl font-bold text-white">{dashboardStats.todayMessages.toLocaleString()}</p>
                      <p className="text-cyan-400 text-sm">{dashboardStats.totalMessages.toLocaleString()} total</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Ocean Impact</p>
                      <p className="text-2xl font-bold text-white">{(dashboardStats.oceanLitersCleaned / 1000).toFixed(1)}M</p>
                      <p className="text-blue-400 text-sm">Liters Cleaned</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Conversion Rate</span>
                    <span className="text-green-400 font-medium">{dashboardStats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Churn Rate</span>
                    <span className="text-yellow-400 font-medium">{dashboardStats.churnRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg LTV</span>
                    <span className="text-blue-400 font-medium">${dashboardStats.lifetimeValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Credits/User</span>
                    <span className="text-cyan-400 font-medium">{dashboardStats.averageCreditsPerUser}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-green-400 font-medium">{dashboardStats.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Inactive Users</span>
                    <span className="text-gray-400 font-medium">{dashboardStats.inactiveUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">New This Week</span>
                    <span className="text-blue-400 font-medium">{dashboardStats.newUsersThisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Referrals</span>
                    <span className="text-yellow-400 font-medium">{dashboardStats.totalReferrals}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">API Status</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Payment System</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Email Service</span>
                    <Badge className="bg-yellow-600/20 text-yellow-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Limited
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Users Tab - Enhanced */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-gray-400">Manage users, plans, and permissions</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportData('users')} variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              <Button
                onClick={() => handleBulkAction('suspend')}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Bulk Actions
              </Button>
            </div>

            {/* Enhanced Users Table */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr className="text-left">
                        <th className="p-4 text-gray-400">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="p-4 text-gray-400">User</th>
                        <th className="p-4 text-gray-400">Plan</th>
                        <th className="p-4 text-gray-400">Credits</th>
                        <th className="p-4 text-gray-400">Messages</th>
                        <th className="p-4 text-gray-400">Referrals</th>
                        <th className="p-4 text-gray-400">Earnings</th>
                        <th className="p-4 text-gray-400">Last Login</th>
                        <th className="p-4 text-gray-400">Status</th>
                        <th className="p-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={
                              user.plan === 'Pro' ? 'bg-purple-600/20 text-purple-400' :
                              user.plan === 'Plus' ? 'bg-blue-600/20 text-blue-400' :
                              'bg-gray-600/20 text-gray-400'
                            }>
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="p-4 text-white">{user.credits.toLocaleString()}</td>
                          <td className="p-4 text-gray-300">{user.totalMessages}</td>
                          <td className="p-4 text-yellow-400">{user.referrals}</td>
                          <td className="p-4 text-green-400 font-medium">{user.earnings}</td>
                          <td className="p-4 text-gray-300 text-sm">{user.lastLogin}</td>
                          <td className="p-4">
                            <Badge className={
                              user.status === 'active'
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-red-600/20 text-red-400'
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Referrals Tab - Enhanced */}
        {activeTab === 'referrals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Referral Management</h2>
                <p className="text-gray-400">Track referrals, commissions, and network growth</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportData('referrals')} variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Enhanced Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-400">{dashboardStats.totalReferrals}</p>
                      <p className="text-sm text-gray-400">Total Referrals</p>
                      <p className="text-xs text-green-400 mt-1">+47 this week</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">$2,340</p>
                      <p className="text-sm text-gray-400">Pending Commissions</p>
                      <p className="text-xs text-yellow-400 mt-1">{dashboardStats.pendingPayouts} payouts due</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">$15,680</p>
                      <p className="text-sm text-gray-400">Total Paid Out</p>
                      <p className="text-xs text-blue-400 mt-1">This month: $2,890</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-cyan-400">23.4%</p>
                      <p className="text-sm text-gray-400">Conversion Rate</p>
                      <p className="text-xs text-cyan-400 mt-1">↑ 3.2% vs last month</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Referrals Table */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Recent Referrals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr className="text-left">
                        <th className="p-4 text-gray-400">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="p-4 text-gray-400">Referrer</th>
                        <th className="p-4 text-gray-400">Referred User</th>
                        <th className="p-4 text-gray-400">Plan</th>
                        <th className="p-4 text-gray-400">Commission</th>
                        <th className="p-4 text-gray-400">Level</th>
                        <th className="p-4 text-gray-400">Status</th>
                        <th className="p-4 text-gray-400">Date</th>
                        <th className="p-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralData.map((referral) => (
                        <tr key={referral.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-white font-medium">{referral.referrer}</p>
                              <p className="text-sm text-gray-400">{referral.referrerEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-white font-medium">{referral.referred}</p>
                              <p className="text-sm text-gray-400">{referral.referredEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={
                              referral.plan === 'Pro' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                            }>
                              {referral.plan}
                            </Badge>
                          </td>
                          <td className="p-4 text-green-400 font-medium">{referral.commission}</td>
                          <td className="p-4">
                            <Badge className="bg-purple-600/20 text-purple-400">L{referral.level}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={
                              referral.status === 'active'
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-yellow-600/20 text-yellow-400'
                            }>
                              {referral.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-300">{referral.date}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payments Tab - Enhanced */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Payment Management</h2>
                <p className="text-gray-400">Manage payouts, commissions, and payment scheduling</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportData('payments')} variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Batch Payouts
                </Button>
              </div>
            </div>

            {/* Payment Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">$2,340</p>
                      <p className="text-sm text-gray-400">Pending Payouts</p>
                      <p className="text-xs text-yellow-400 mt-1">{dashboardStats.pendingPayouts} users</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-400">$890</p>
                      <p className="text-sm text-gray-400">Today's Payouts</p>
                      <p className="text-xs text-green-400 mt-1">3 processed</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">$15,680</p>
                      <p className="text-sm text-gray-400">Total Paid Out</p>
                      <p className="text-xs text-blue-400 mt-1">This month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-400">2</p>
                      <p className="text-sm text-gray-400">Failed Payments</p>
                      <p className="text-xs text-red-400 mt-1">Need attention</p>
                    </div>
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Payment Schedule */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Payment Schedule & Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr className="text-left">
                        <th className="p-4 text-gray-400">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="p-4 text-gray-400">User</th>
                        <th className="p-4 text-gray-400">Amount</th>
                        <th className="p-4 text-gray-400">Type</th>
                        <th className="p-4 text-gray-400">PayPal Email</th>
                        <th className="p-4 text-gray-400">Due Date</th>
                        <th className="p-4 text-gray-400">Status</th>
                        <th className="p-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-white font-medium">{payment.user}</p>
                              <p className="text-sm text-gray-400">{payment.email}</p>
                            </div>
                          </td>
                          <td className="p-4 text-green-400 font-medium">{payment.amount}</td>
                          <td className="p-4">
                            <Badge className="bg-blue-600/20 text-blue-400">{payment.type}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">{payment.paypalEmail}</span>
                            </div>
                          </td>
                          <td className="p-4 text-white">{payment.dueDate}</td>
                          <td className="p-4">
                            <Badge className={
                              payment.status === 'pending'
                                ? 'bg-yellow-600/20 text-yellow-400'
                                : payment.status === 'scheduled'
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'bg-green-600/20 text-green-400'
                            }>
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {payment.status === 'pending' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Pay Now
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab - Enhanced */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Chat Analytics & Insights</h2>
                <p className="text-gray-400">Detailed analytics on AI usage, user behavior, and platform performance</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportData('analytics')} variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            </div>

            {/* Enhanced Chat Usage by Persona */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  AI Persona Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatAnalytics.map((persona, index) => (
                    <div key={persona.persona} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                              <Bot className="w-4 h-4 text-blue-400" />
                            </div>
                            <h4 className="font-medium text-white">{persona.persona}</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">{persona.usage}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">{persona.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: persona.usage }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{persona.messages.toLocaleString()} messages</span>
                          <span>Avg {persona.avgCredits} credits/msg</span>
                          <span>{persona.satisfaction}/5.0 satisfaction</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Analytics Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    Credits Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-cyan-400">{dashboardStats.totalCreditsUsed.toLocaleString()}</p>
                      <p className="text-gray-400">Total Credits Used</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Today</span>
                        <span className="text-white font-medium">23,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">This Week</span>
                        <span className="text-white font-medium">156,789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">This Month</span>
                        <span className="text-white font-medium">634,521</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg per User</span>
                        <span className="text-cyan-400 font-medium">{dashboardStats.averageCreditsPerUser}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    Ocean Impact Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-400">{(dashboardStats.oceanLitersCleaned / 1000).toFixed(1)}M</p>
                      <p className="text-gray-400">Liters Ocean Water Cleaned</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Equivalent to</span>
                        <span className="text-white font-medium">520 Olympic Pools</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">This Month</span>
                        <span className="text-white font-medium">+234,567L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth Rate</span>
                        <span className="text-green-400 font-medium">+15.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Impact</span>
                        <span className="text-blue-400 font-medium">{dashboardStats.todayMessages.toLocaleString()}L</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Growth Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400">{dashboardStats.conversionRate}%</p>
                      <p className="text-gray-400">Conversion Rate</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Churn Rate</span>
                        <span className="text-yellow-400 font-medium">{dashboardStats.churnRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg LTV</span>
                        <span className="text-white font-medium">${dashboardStats.lifetimeValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">New Users Week</span>
                        <span className="text-green-400 font-medium">+{dashboardStats.newUsersThisWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retention Rate</span>
                        <span className="text-green-400 font-medium">87.3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Trends Chart Placeholder */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Usage Trends & Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Interactive charts would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Message frequency, peak hours, persona popularity over time</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content Tab - Enhanced */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Content Management</h2>
                <p className="text-gray-400">Customize homepage content, texts, and media</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
                <Button onClick={handleSaveContent} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Homepage Hero Section */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-400" />
                    Homepage Hero Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Title
                    </label>
                    <Input
                      value={homepageContent.heroTitle}
                      onChange={(e) => setHomepageContent({...homepageContent, heroTitle: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Subtitle
                    </label>
                    <Input
                      value={homepageContent.heroSubtitle}
                      onChange={(e) => setHomepageContent({...homepageContent, heroSubtitle: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Description
                    </label>
                    <textarea
                      value={homepageContent.heroDescription}
                      onChange={(e) => setHomepageContent({...homepageContent, heroDescription: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Background Image URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={homepageContent.heroImage}
                        onChange={(e) => setHomepageContent({...homepageContent, heroImage: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="https://..."
                      />
                      <Button variant="outline" className="border-gray-600">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CTA Button Text
                    </label>
                    <Input
                      value={homepageContent.ctaButtonText}
                      onChange={(e) => setHomepageContent({...homepageContent, ctaButtonText: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Homepage Statistics */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Homepage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Liters Cleaned Display
                      </label>
                      <Input
                        value={homepageContent.statsLitersCleaned}
                        onChange={(e) => setHomepageContent({...homepageContent, statsLitersCleaned: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Active Users Display
                      </label>
                      <Input
                        value={homepageContent.statsActiveUsers}
                        onChange={(e) => setHomepageContent({...homepageContent, statsActiveUsers: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        AI Specialists Count
                      </label>
                      <Input
                        value={homepageContent.statsAiSpecialists}
                        onChange={(e) => setHomepageContent({...homepageContent, statsAiSpecialists: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Section */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Features Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Features Title
                    </label>
                    <Input
                      value={homepageContent.featuresTitle}
                      onChange={(e) => setHomepageContent({...homepageContent, featuresTitle: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Features Subtitle
                    </label>
                    <textarea
                      value={homepageContent.featuresSubtitle}
                      onChange={(e) => setHomepageContent({...homepageContent, featuresSubtitle: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ocean Section */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    Ocean Impact Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ocean Section Title
                    </label>
                    <Input
                      value={homepageContent.oceanTitle}
                      onChange={(e) => setHomepageContent({...homepageContent, oceanTitle: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ocean Section Description
                    </label>
                    <textarea
                      value={homepageContent.oceanDescription}
                      onChange={(e) => setHomepageContent({...homepageContent, oceanDescription: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Actions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Content Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleSaveContent} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Content
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Download className="w-4 h-4 mr-2" />
                    Export Content
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings Tab - Enhanced */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">System Settings</h2>
                <p className="text-gray-400">Configure platform settings, pricing, and system preferences</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-600">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max File Size (MB)
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Default Credits for New Users
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.defaultCredits}
                      onChange={(e) => setSystemSettings({...systemSettings, defaultCredits: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Referral Bonus Credits
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.referralBonusCredits}
                      onChange={(e) => setSystemSettings({...systemSettings, referralBonusCredits: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {/* Feature Toggles */}
                  <div className="space-y-3 pt-4 border-t border-gray-600">
                    <h4 className="font-medium text-white">Feature Toggles</h4>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Maintenance Mode</span>
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">User Registration</span>
                      <input
                        type="checkbox"
                        checked={systemSettings.registrationEnabled}
                        onChange={(e) => setSystemSettings({...systemSettings, registrationEnabled: e.target.checked})}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Referral System</span>
                      <input
                        type="checkbox"
                        checked={systemSettings.referralSystemEnabled}
                        onChange={(e) => setSystemSettings({...systemSettings, referralSystemEnabled: e.target.checked})}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Ocean Cleanup Feature</span>
                      <input
                        type="checkbox"
                        checked={systemSettings.oceanCleanupEnabled}
                        onChange={(e) => setSystemSettings({...systemSettings, oceanCleanupEnabled: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Payment & Pricing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credit Price (USD)
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      value={systemSettings.creditPrice}
                      onChange={(e) => setSystemSettings({...systemSettings, creditPrice: parseFloat(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Price per credit in USD</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Payout Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.minimumPayout}
                      onChange={(e) => setSystemSettings({...systemSettings, minimumPayout: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Minimum amount before payout is processed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin PayPal Email
                    </label>
                    <Input
                      type="email"
                      value={systemSettings.paypalEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, paypalEmail: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">PayPal email for processing payouts</p>
                  </div>

                  {/* Payment Stats */}
                  <div className="pt-4 border-t border-gray-600">
                    <h4 className="font-medium text-white mb-3">Payment Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Revenue</span>
                        <span className="text-green-400 font-medium">${dashboardStats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pending Payouts</span>
                        <span className="text-yellow-400 font-medium">${(dashboardStats.pendingPayouts * 195.5).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Credits Sold</span>
                        <span className="text-blue-400 font-medium">{Math.floor(dashboardStats.totalRevenue / systemSettings.creditPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Security & Access Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Change Admin Password
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Current password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="New password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Two-Factor Authentication
                    </label>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white text-sm">Enable 2FA</p>
                        <p className="text-gray-400 text-xs">Secure your admin account with 2FA</p>
                      </div>
                      <Button variant="outline" className="border-gray-600 text-gray-300">
                        Setup
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Management
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <p className="text-white text-sm">Active Sessions</p>
                          <p className="text-gray-400 text-xs">Current admin sessions: 1</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                          Revoke All
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Version</span>
                      <span className="text-white font-medium">Miky.ai v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Database Status</span>
                      <Badge className="bg-green-600/20 text-green-400">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">API Status</span>
                      <Badge className="bg-green-600/20 text-green-400">Operational</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email Service</span>
                      <Badge className="bg-yellow-600/20 text-yellow-400">Limited</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Backup</span>
                      <span className="text-gray-300">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Server Uptime</span>
                      <span className="text-green-400">7 days, 14h</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        <Download className="w-3 h-3 mr-1" />
                        Export Logs
                      </Button>
                      <Button variant="outline" size="sm" className="border-blue-600 text-blue-400">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Create Backup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
