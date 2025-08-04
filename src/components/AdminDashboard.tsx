import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  X, 
  Users, 
  CreditCard, 
  TrendUp, 
  Settings, 
  Download,
  UserCheck,
  UserX,
  Coins,
  ChartLine,
  Handshake,
  ChatCircle,
  Brain,
  ShieldCheck,
  Robot,
  MoneyWavy,
  GlobeHemisphereWest,
  PencilSimple,
  Globe,
  Image,
  Tag,
  TwitterLogo,
  FacebookLogo
} from '@phosphor-icons/react'

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingCredits, setEditingCredits] = useState<string | null>(null)
  const [tempCredits, setTempCredits] = useState<{ [key: string]: number }>({})
  const [showCreditCostModal, setShowCreditCostModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showPersonaTextModal, setShowPersonaTextModal] = useState(false)
  const [userSuspensions, setUserSuspensions] = useState<{ [key: string]: boolean }>({})
  const [creditCosts, setCreditCosts] = useState({
    general: 1,
    lawyer: 3,
    engineer: 2,
    marketer: 2,
    coach: 2,
    medical: 3,
    'god-mode': 5
  })
  const [personaTexts, setPersonaTexts] = useState({
    lawyer: {
      description: 'Legal advice and contract help',
      detailedDescription: 'Ultra-skilled AI Lawyer specialized in national and international law. Provides advanced consulting in civil, criminal, commercial, tax, labor, administrative, and technology law. Drafts legal documents, contracts, opinions, defenses, exposés, complaints, and preventive filings with precision and academic rigor.'
    },
    engineer: {
      description: 'Technical help and code review',
      detailedDescription: 'Senior AI Engineer capable of writing, correcting and reviewing code in over 20 languages: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash, and many others. Provides architectural solutions, complex debugging, performance optimization and AI integration.'
    },
    marketer: {
      description: 'Brand growth and marketing plans',
      detailedDescription: 'Strategic AI Marketer with advanced expertise in brand positioning, organic growth, paid campaigns, SEO/SEM, data analysis, conversion funnels, persuasive copywriting and social media management (Instagram, TikTok, X, LinkedIn, Facebook). Supports entrepreneurs, agencies and creators in building and scaling digital projects.'
    },
    coach: {
      description: 'Personal goals and life coaching',
      detailedDescription: 'High-level AI Life & Performance Coach, capable of helping you overcome emotional blocks, organize your life, improve productivity, find motivation, develop winning habits, work on personal relationships, physical wellness and personal growth. No topic is too complex for Coach Miky.'
    },
    medical: {
      description: 'Health tips and wellness support',
      detailedDescription: 'Medical AI Consultant highly specialized in analyzing symptoms, reports, radiographs, CT scans, X-rays, blood tests and medical records. Supports diagnosis, offers lifestyle guidance, dietary plans, integrative approaches and helps you understand any medical report. You can also send images and documents for in-depth analysis.'
    },
    'god-mode': {
      description: 'Uncover the purpose of existence',
      detailedDescription: 'Philosophical AI Explorer, capable of answering the deepest and most mysterious questions about the universe, existence, consciousness, free will, destiny. Accompanies you on an intellectual and spiritual journey exploring the deepest mysteries of reality. But first of all asks you: Are you really sure you exist?'
    }
  })
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    plan: 'free'
  })
  const [editingPersonaText, setEditingPersonaText] = useState<{
    persona: string
    field: 'description' | 'detailedDescription'
  } | null>(null)
  const [tempPersonaText, setTempPersonaText] = useState('')
  
  // Homepage text state
  const [homepageTexts, setHomepageTexts] = useState({
    subtitle: 'Ultra-skilled AI personas ready to act as your advisors in life, work, and achievement.',
    selectorTitle: 'Choose your personalized AI specialist:'
  })
  const [showHomepageTextModal, setShowHomepageTextModal] = useState(false)
  
  // SEO settings state
  const [seoSettings, setSeoSettings] = useState({
    title: 'Miky.ai - Ultra-Skilled AI Personas for Your Goals',
    metaDescription: 'AI Personas highly trained for your personal, professional, and technical goals.',
    keywords: 'AI assistant, AI personas, artificial intelligence, lawyer AI, engineer AI, marketing AI, coach AI, medical AI, productivity, automation',
    ogTitle: 'Miky.ai - Ultra-Skilled AI Personas for Your Goals',
    ogDescription: 'AI Personas highly trained for your personal, professional, and technical goals.',
    twitterTitle: 'Miky.ai - Ultra-Skilled AI Personas for Your Goals',
    twitterDescription: 'AI Personas highly trained for your personal, professional, and technical goals.',
    canonicalUrl: 'https://miky.ai',
    author: 'Neuronica Srl',
    themeColor: '#7FFF00'
  })
  const [showSeoModal, setShowSeoModal] = useState(false)
  const [editingSeoField, setEditingSeoField] = useState<string | null>(null)
  const [tempSeoValue, setTempSeoValue] = useState('')
  
  // Feature toggles state
  const [featureToggles, setFeatureToggles] = useState({
    voiceInput: true,
    fileUpload: false,
    godMode: true,
    referralProgram: true,
    multilingualSupport: true,
    emailVerification: true,
    chatHistory: true,
    dataExport: true
  })

  // Mock admin data - reflecting actual Miky.ai functionality
  const mockData = {
    overview: {
      totalUsers: 3247,
      activeUsers: 1856,
      totalCreditsUsed: 125430,
      totalConversations: 8940,
      revenue: 28940,
      conversionsThisMonth: 89,
      totalReferrals: 456,
      pendingCashouts: 12
    },
    users: [
      { 
        id: '1', 
        email: 'john.smith@example.com', 
        firstName: 'John', 
        lastName: 'Smith',
        plan: 'plus', 
        credits: 850, 
        status: 'active', 
        joined: '2024-12-15',
        referrals: 3,
        totalSpent: 57,
        language: 'English'
      },
      { 
        id: '2', 
        email: 'maria.garcia@example.com', 
        firstName: 'Maria', 
        lastName: 'Garcia',
        plan: 'free', 
        credits: 45, 
        status: 'active', 
        joined: '2024-12-20',
        referrals: 0,
        totalSpent: 0,
        language: 'Español'
      },
      { 
        id: '3', 
        email: 'support@miky.ai', 
        firstName: 'Test', 
        lastName: 'User',
        plan: 'business', 
        credits: 3200, 
        status: 'active', 
        joined: '2024-11-10',
        referrals: 20,
        totalSpent: 147,
        language: 'English'
      },
    ],
    financials: {
      monthlyRevenue: 28940,
      churnRate: 3.2,
      averageRevenue: 32.50,
      pendingCashouts: 240,
      referralPayouts: 912,
      subscriptions: {
        free: 2189,
        plus: 832,
        business: 226
      },
      creditPurchases: {
        thisMonth: 156,
        totalRevenue: 4320
      }
    },
    personas: {
      usage: {
        general: 2345,
        lawyer: 1234,
        engineer: 987,
        marketer: 856,
        coach: 723,
        medical: 645,
        'god-mode': 234
      },
      avgCreditsPerPersona: {
        general: 1,
        lawyer: 3,
        engineer: 2,
        marketer: 2,
        coach: 2,
        medical: 3,
        'god-mode': 5
      }
    },
    referrals: {
      totalReferrals: 456,
      successfulSignups: 234,
      pendingCashouts: 12,
      totalCashoutRequests: 89,
      averageReferralValue: 2.00
    },
    conversations: {
      total: 8940,
      avgPerUser: 4.8,
      avgLength: 12.3,
      languageDistribution: {
        'English': 7156,
        'Español': 892,
        'Italiano': 456,
        'Deutsch': 234,
        '日本語': 123,
        '한국어': 79
      }
    }
  }

  const handleExportUsers = () => {
    // Mock CSV export with actual user data structure
    const csvContent = 'Email,First Name,Last Name,Plan,Credits,Status,Joined,Referrals,Total Spent,Language\n' + 
      mockData.users.map(u => `${u.email},${u.firstName},${u.lastName},${u.plan},${u.credits},${u.status},${u.joined},${u.referrals},$${u.totalSpent},${u.language}`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miky-users-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Users data exported successfully')
  }

  const handleExportConversations = () => {
    // Mock conversation export
    const csvContent = 'Date,User Email,Persona,Messages Count,Credits Used,Language\n' + 
      mockData.users.map(u => 
        `${new Date().toISOString().split('T')[0]},${u.email},General,5,5,${u.language}`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miky-conversations-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Conversations data exported successfully')
  }

  const handleGenerateReport = () => {
    // Mock report generation
    const reportContent = `Miky.ai System Report - ${new Date().toLocaleDateString()}
    
Total Users: ${mockData.overview.totalUsers}
Active Users: ${mockData.overview.activeUsers}
Total Revenue: $${mockData.overview.revenue}
Credits Used: ${mockData.overview.totalCreditsUsed}
Conversations: ${mockData.overview.totalConversations}

Subscription Distribution:
- Free: ${mockData.financials.subscriptions.free} users
- Plus: ${mockData.financials.subscriptions.plus} users  
- Business: ${mockData.financials.subscriptions.business} users

Generated on: ${new Date().toISOString()}`

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miky-system-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('System report generated and downloaded')
  }

  const handleSystemSettings = () => {
    setActiveTab('settings')
    toast.success('Navigated to system settings')
  }

  const handleAddUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Mock user creation
    console.log('Creating new user:', newUser)
    toast.success(`User ${newUser.firstName} ${newUser.lastName} created successfully`)
    setShowAddUserModal(false)
    setNewUser({ email: '', firstName: '', lastName: '', plan: 'free' })
  }

  const handleToggleUserSuspension = (userId: string) => {
    setUserSuspensions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
    const isNowSuspended = !userSuspensions[userId]
    toast.success(`User ${isNowSuspended ? 'suspended' : 'activated'} successfully`)
  }

  const handleUpdateCredits = (userId: string) => {
    const newCredits = tempCredits[userId]
    if (newCredits !== undefined && newCredits >= 0) {
      console.log('Updating credits for user:', userId, 'to:', newCredits)
      toast.success(`Credits updated to ${newCredits}`)
      setEditingCredits(null)
      setTempCredits(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    }
  }

  const handleCancelCreditsEdit = (userId: string) => {
    setEditingCredits(null)
    setTempCredits(prev => {
      const updated = { ...prev }
      delete updated[userId]
      return updated
    })
  }

  const handlePersonaAction = (action: string) => {
    switch(action) {
      case 'configure-models':
        toast.success('AI Models configuration opened')
        // Open AI models configuration panel
        break
      case 'adjust-costs':
        setShowCreditCostModal(true)
        break
      case 'edit-texts':
        setShowPersonaTextModal(true)
        break
      case 'manage-restrictions':
        toast.success('Restrictions management panel opened')
        // Open restrictions management panel
        break
      default:
        break
    }
  }

  const handleUpdateCreditCosts = () => {
    console.log('Updated credit costs:', creditCosts)
    toast.success('Credit costs updated successfully')
    setShowCreditCostModal(false)
  }

  const handleUpdatePersonaTexts = () => {
    console.log('Updated persona texts:', personaTexts)
    toast.success('Persona texts updated successfully')
    setShowPersonaTextModal(false)
  }

  const handleUpdateHomepageTexts = () => {
    // In a real app, this would update the database
    // For now we just show success message
    toast.success('Homepage content updated successfully')
  }

  const handleEditPersonaText = (persona: string, field: 'description' | 'detailedDescription') => {
    setEditingPersonaText({ persona, field })
    setTempPersonaText(personaTexts[persona as keyof typeof personaTexts][field])
  }

  const handleSavePersonaText = () => {
    if (editingPersonaText) {
      setPersonaTexts(prev => ({
        ...prev,
        [editingPersonaText.persona]: {
          ...prev[editingPersonaText.persona as keyof typeof prev],
          [editingPersonaText.field]: tempPersonaText
        }
      }))
      setEditingPersonaText(null)
      setTempPersonaText('')
      toast.success('Persona text updated successfully')
    }
  }

  const handleCancelPersonaTextEdit = () => {
    setEditingPersonaText(null)
    setTempPersonaText('')
  }

  const handleConversationAction = (action: string) => {
    switch(action) {
      case 'export':
        handleExportConversations()
        break
      case 'generate':
        toast.success('Usage report generation started')
        setTimeout(() => {
          toast.success('Usage report generated successfully')
        }, 2000)
        break
      case 'review':
        toast.success('Content review panel opened')
        break
      default:
        break
    }
  }

  const handleFeatureToggle = (feature: keyof typeof featureToggles) => {
    setFeatureToggles(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
    toast.success(`${feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${featureToggles[feature] ? 'disabled' : 'enabled'}`)
  }

  // SEO Management Functions
  const handleUpdateSeoSettings = () => {
    // In a real app, this would update the HTML meta tags dynamically
    console.log('Updated SEO settings:', seoSettings)
    toast.success('SEO settings updated successfully')
    setShowSeoModal(false)
  }

  const handleEditSeoField = (field: string) => {
    setEditingSeoField(field)
    setTempSeoValue(seoSettings[field as keyof typeof seoSettings])
  }

  const handleSaveSeoField = () => {
    if (editingSeoField) {
      setSeoSettings(prev => ({
        ...prev,
        [editingSeoField]: tempSeoValue
      }))
      setEditingSeoField(null)
      setTempSeoValue('')
      toast.success('SEO field updated successfully')
    }
  }

  const handleCancelSeoEdit = () => {
    setEditingSeoField(null)
    setTempSeoValue('')
  }

  const handleFileUpload = (type: 'favicon' | 'ogImage') => {
    // In a real app, this would handle file upload
    toast.success(`${type === 'favicon' ? 'Favicon' : 'Social sharing image'} uploaded successfully`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Assets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{mockData.overview.activeUsers.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Used</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalCreditsUsed.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${mockData.overview.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <ChatCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Conversations</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalConversations.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold">{mockData.overview.conversionsThisMonth}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalReferrals}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MoneyWavy className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                    <p className="text-2xl font-bold">{mockData.overview.pendingCashouts}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start hover:text-primary" onClick={handleExportUsers}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Users
                </Button>
                <Button variant="outline" className="justify-start hover:text-primary" onClick={handleExportConversations}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Conversations
                </Button>
                <Button variant="outline" className="justify-start hover:text-primary" onClick={handleGenerateReport}>
                  <ChartLine className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="justify-start hover:text-primary" onClick={handleSystemSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">User Management</h2>
              <div className="flex gap-2">
                <Button onClick={handleExportUsers} variant="outline" size="sm" className="hover:text-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:text-primary">
                      <Users className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan">Initial Plan</Label>
                        <select
                          id="plan"
                          value={newUser.plan}
                          onChange={(e) => setNewUser(prev => ({ ...prev, plan: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                        >
                          <option value="free">Free</option>
                          <option value="plus">Plus</option>
                          <option value="business">Business</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddUser} className="flex-1">Create User</Button>
                        <Button variant="outline" onClick={() => setShowAddUserModal(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Suspended</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.plan === 'free' ? 'secondary' : user.plan === 'plus' ? 'default' : 'destructive'}>
                          {user.plan.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {editingCredits === user.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempCredits[user.id] ?? user.credits}
                              onChange={(e) => setTempCredits(prev => ({
                                ...prev,
                                [user.id]: parseInt(e.target.value) || 0
                              }))}
                              className="w-20"
                              min="0"
                            />
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleUpdateCredits(user.id)}
                            >
                              ✓
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleCancelCreditsEdit(user.id)}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{user.credits}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCredits(user.id)
                                setTempCredits(prev => ({ ...prev, [user.id]: user.credits }))
                              }}
                            >
                              <PencilSimple className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.referrals}</TableCell>
                      <TableCell>${user.totalSpent}</TableCell>
                      <TableCell>{user.language}</TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>
                        <Switch
                          checked={userSuspensions[user.id] || false}
                          onCheckedChange={() => handleToggleUserSuspension(user.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <h2 className="text-lg font-medium">Financial Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${mockData.financials.monthlyRevenue.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold">{mockData.financials.churnRate}%</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Avg Revenue/User</p>
                <p className="text-2xl font-bold">${mockData.financials.averageRevenue}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                <p className="text-2xl font-bold">${mockData.financials.pendingCashouts}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Subscription Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.financials.subscriptions).map(([plan, count]) => (
                    <div key={plan} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{plan}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan === 'free' ? 'secondary' : 'default'}>
                          {count} users
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {((count / Object.values(mockData.financials.subscriptions).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Credit Purchases</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-medium">{mockData.financials.creditPurchases.thisMonth} purchases</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">${mockData.financials.creditPurchases.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Payouts</span>
                    <span className="font-medium">${mockData.financials.referralPayouts}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <h2 className="text-lg font-medium">AI Personas Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Usage by Persona</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.personas.usage).map(([persona, usage]) => (
                    <div key={persona} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="capitalize">{persona === 'god-mode' ? 'God Mode' : persona}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{usage} conversations</Badge>
                        <span className="text-sm text-muted-foreground">
                          {mockData.personas.avgCreditsPerPersona[persona as keyof typeof mockData.personas.avgCreditsPerPersona]} credits avg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Persona Settings</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Configure AI model routing and credit costs for each persona</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:text-primary"
                      onClick={() => handlePersonaAction('configure-models')}
                    >
                      <Robot className="w-4 h-4 mr-2" />
                      Configure AI Models
                    </Button>
                    <Dialog open={showCreditCostModal} onOpenChange={setShowCreditCostModal}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start hover:text-primary"
                          onClick={() => handlePersonaAction('adjust-costs')}
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          Adjust Credit Costs
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Adjust Credit Costs per Persona</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {Object.entries(creditCosts).map(([persona, cost]) => (
                            <div key={persona} className="flex items-center justify-between">
                              <Label className="capitalize">
                                {persona === 'god-mode' ? 'God Mode' : persona}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={cost}
                                  onChange={(e) => setCreditCosts(prev => ({
                                    ...prev,
                                    [persona]: parseInt(e.target.value) || 1
                                  }))}
                                  className="w-20"
                                  min="1"
                                  max="10"
                                />
                                <span className="text-sm text-muted-foreground">credits</span>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleUpdateCreditCosts} className="flex-1">
                              Update Costs
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCreditCostModal(false)} 
                              className="flex-1 hover:text-primary"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={showPersonaTextModal} onOpenChange={setShowPersonaTextModal}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start hover:text-primary"
                          onClick={() => handlePersonaAction('edit-texts')}
                        >
                          <PencilSimple className="w-4 h-4 mr-2" />
                          Edit Persona Texts
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Persona Information</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {Object.entries(personaTexts).map(([persona, texts]) => (
                            <div key={persona} className="border rounded-lg p-4 space-y-4">
                              <h4 className="font-medium capitalize text-lg">
                                {persona === 'god-mode' ? 'God Mode' : persona} Miky
                              </h4>
                              
                              {/* Short Description */}
                              <div>
                                <Label className="text-sm font-medium">Short Description</Label>
                                {editingPersonaText?.persona === persona && editingPersonaText?.field === 'description' ? (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Input
                                      value={tempPersonaText}
                                      onChange={(e) => setTempPersonaText(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button size="sm" onClick={handleSavePersonaText}>✓</Button>
                                    <Button size="sm" variant="ghost" onClick={handleCancelPersonaTextEdit}>✕</Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="flex-1 text-sm bg-muted p-2 rounded">
                                      {texts.description}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditPersonaText(persona, 'description')}
                                    >
                                      <PencilSimple className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Detailed Description */}
                              <div>
                                <Label className="text-sm font-medium">Detailed Description (Info Popup)</Label>
                                {editingPersonaText?.persona === persona && editingPersonaText?.field === 'detailedDescription' ? (
                                  <div className="space-y-2 mt-1">
                                    <Textarea
                                      value={tempPersonaText}
                                      onChange={(e) => setTempPersonaText(e.target.value)}
                                      rows={4}
                                      className="resize-none"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleSavePersonaText}>Save</Button>
                                      <Button size="sm" variant="ghost" onClick={handleCancelPersonaTextEdit}>Cancel</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2 mt-1">
                                    <div className="flex-1 text-sm bg-muted p-3 rounded leading-relaxed">
                                      {texts.detailedDescription}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditPersonaText(persona, 'detailedDescription')}
                                    >
                                      <PencilSimple className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleUpdatePersonaTexts} className="flex-1">
                              Save All Changes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowPersonaTextModal(false)} 
                              className="flex-1 hover:text-primary"
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:text-primary"
                      onClick={() => handlePersonaAction('manage-restrictions')}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Manage Restrictions
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <h2 className="text-lg font-medium">Referral Program Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-bold">{mockData.referrals.totalReferrals}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Successful Signups</p>
                    <p className="text-2xl font-bold">{mockData.referrals.successfulSignups}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MoneyWavy className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                    <p className="text-2xl font-bold">{mockData.referrals.pendingCashouts}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Referral Value</p>
                    <p className="text-2xl font-bold">${mockData.referrals.averageReferralValue}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Referral Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Referral Reward (per signup)</label>
                    <Input defaultValue="$2.00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bonus Credits for Invitee</label>
                    <Input defaultValue="300" className="mt-1" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Cashout</label>
                    <Input defaultValue="$10.00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PayPal Processing Fee</label>
                    <Input defaultValue="2.9%" className="mt-1" />
                  </div>
                </div>
              </div>
              <Button className="mt-4">Update Settings</Button>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <h2 className="text-lg font-medium">Conversation Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <ChatCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Conversations</p>
                    <p className="text-2xl font-bold">{mockData.conversations.total.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per User</p>
                    <p className="text-2xl font-bold">{mockData.conversations.avgPerUser}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Length</p>
                    <p className="text-2xl font-bold">{mockData.conversations.avgLength} messages</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <GlobeHemisphereWest className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Languages</p>
                    <p className="text-2xl font-bold">{Object.keys(mockData.conversations.languageDistribution).length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Language Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.conversations.languageDistribution).map(([language, count]) => (
                    <div key={language} className="flex justify-between items-center">
                      <span>{language}</span>
                      <div className="flex items-center gap-2">
                        <Badge>{count} conversations</Badge>
                        <span className="text-sm text-muted-foreground">
                          {((count / mockData.conversations.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Conversation Management</h3>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:text-primary" 
                    onClick={() => handleConversationAction('export')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Conversation Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:text-primary"
                    onClick={() => handleConversationAction('generate')}
                  >
                    <ChartLine className="w-4 h-4 mr-2" />
                    Generate Usage Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:text-primary"
                    onClick={() => handleConversationAction('review')}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Review Flagged Content
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <h2 className="text-lg font-medium">Content Management</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Homepage Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Main Title</label>
                  <Input defaultValue="Ask to Miky" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input 
                    value={homepageTexts.subtitle}
                    onChange={(e) => setHomepageTexts(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Persona Section Title</label>
                  <Input 
                    value={homepageTexts.selectorTitle}
                    onChange={(e) => setHomepageTexts(prev => ({ ...prev, selectorTitle: e.target.value }))}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Upgrade Message</label>
                  <Input defaultValue="Upgrade to unlock Medical and God Mode personas" className="mt-1" />
                </div>
                <Button 
                  onClick={handleUpdateHomepageTexts}
                >
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Persona Descriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Lawyer</label>
                  <Input defaultValue="Legal advice and contract help" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Engineer</label>
                  <Input defaultValue="Technical help and code review" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Marketer</label>
                  <Input defaultValue="Brand growth and marketing plans" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Coach</label>
                  <Input defaultValue="Personal goals and life coaching" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Medical Advisor</label>
                  <Input defaultValue="Health tips and wellness support" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">God Mode</label>
                  <Input defaultValue="Uncover the purpose of existence" className="mt-1" />
                </div>
              </div>
              <Button className="mt-4">Update Descriptions</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Pricing Page Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Free Plan Credits</label>
                  <Input defaultValue="100" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Plus Plan Price</label>
                  <Input defaultValue="19" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Business Plan Price</label>
                  <Input defaultValue="49" type="number" className="mt-1" />
                </div>
                <Button>Update Pricing</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Legal Pages</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Legal pages are automatically generated based on company information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input defaultValue="Neuronica Srl" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Email</label>
                    <Input defaultValue="support@miky.ai" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company Address</label>
                    <Input defaultValue="Via del Serrone 62, 47890 Repubblica di San Marino" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input defaultValue="Repubblica di San Marino" className="mt-1" />
                  </div>
                </div>
                <Button>Update Legal Info</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <h2 className="text-lg font-medium">SEO & Assets Management</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Meta Tags & SEO</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(seoSettings).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSeoField(key)}
                          className="hover:text-primary"
                        >
                          <PencilSimple className="w-3 h-3" />
                        </Button>
                      </div>
                      {editingSeoField === key ? (
                        <div className="space-y-2">
                          {key.includes('Description') ? (
                            <Textarea
                              value={tempSeoValue}
                              onChange={(e) => setTempSeoValue(e.target.value)}
                              rows={3}
                            />
                          ) : (
                            <Input
                              value={tempSeoValue}
                              onChange={(e) => setTempSeoValue(e.target.value)}
                            />
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveSeoField}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelSeoEdit} className="hover:text-primary">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                          {value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={handleUpdateSeoSettings} className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Update SEO Settings
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Favicon Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Current</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">favicon.svg</p>
                      <p className="text-xs text-muted-foreground">32×32 px</p>
                    </div>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" />
                  <Button 
                    variant="outline" 
                    className="w-full hover:text-primary"
                    onClick={() => handleFileUpload('favicon')}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Upload New Favicon
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 32×32 px or 16×16 px, SVG or PNG format
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Social Sharing Image</h3>
                <div className="space-y-4">
                  <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Current OG Image</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">og-image.svg</p>
                    <p className="text-xs text-muted-foreground">1200×630 px</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:text-primary"
                    onClick={() => handleFileUpload('ogImage')}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Upload New Image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200×630 px, JPG or PNG format
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Social Media Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FacebookLogo className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Facebook / Open Graph</h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Site Name</label>
                    <Input defaultValue="Miky.ai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Locale</label>
                    <Input defaultValue="en_US" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TwitterLogo className="w-5 h-5 text-blue-400" />
                    <h4 className="font-medium">Twitter / X</h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Twitter Handle</label>
                    <Input defaultValue="@mikyai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Card Type</label>
                    <Input defaultValue="summary_large_image" />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">
                <Tag className="w-4 h-4 mr-2" />
                Update Social Settings
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-lg font-medium">System Settings</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">AI Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <Input type="password" placeholder="sk-..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Default AI Model</label>
                  <Input defaultValue="gpt-4o" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Fallback Model</label>
                  <Input defaultValue="gpt-4o-mini" className="mt-1" />
                </div>
                <Button>Update AI Settings</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Payment Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Stripe Public Key</label>
                  <Input type="password" placeholder="pk_..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stripe Secret Key</label>
                  <Input type="password" placeholder="sk_..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stripe Webhook Secret</label>
                  <Input type="password" placeholder="whsec_..." className="mt-1" />
                </div>
                <Button>Update Payment Settings</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Feature Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Voice Input</span>
                  <Switch 
                    checked={featureToggles.voiceInput}
                    onCheckedChange={() => handleFeatureToggle('voiceInput')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>File Upload</span>
                  <Switch 
                    checked={featureToggles.fileUpload}
                    onCheckedChange={() => handleFeatureToggle('fileUpload')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>God Mode</span>
                  <Switch 
                    checked={featureToggles.godMode}
                    onCheckedChange={() => handleFeatureToggle('godMode')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Referral Program</span>
                  <Switch 
                    checked={featureToggles.referralProgram}
                    onCheckedChange={() => handleFeatureToggle('referralProgram')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Multilingual Support</span>
                  <Switch 
                    checked={featureToggles.multilingualSupport}
                    onCheckedChange={() => handleFeatureToggle('multilingualSupport')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Verification</span>
                  <Switch 
                    checked={featureToggles.emailVerification}
                    onCheckedChange={() => handleFeatureToggle('emailVerification')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Chat History</span>
                  <Switch 
                    checked={featureToggles.chatHistory}
                    onCheckedChange={() => handleFeatureToggle('chatHistory')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Export</span>
                  <Switch 
                    checked={featureToggles.dataExport}
                    onCheckedChange={() => handleFeatureToggle('dataExport')}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}