'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/shared/navigation'
import { CategoryManager } from '@/components/admin/category-manager'
import { NomineeManager } from '@/components/admin/nominee-manager'
import { VotingSettings } from '@/components/admin/voting-settings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { 
  getCategoriesWithNominees, 
  getVotingSettings, 
  DatabaseError 
} from '@/lib/db-queries'
import { getAdminStats } from '@/lib/admin-queries'
import { type Category, type Nominee, type VotingSettings as VotingSettingsType } from '@/lib/supabase'
import { 
  Settings, 
  BarChart3, 
  Users, 
  Trophy, 
  Vote,
  AlertCircle, 
  Loader2,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CategoryWithNominees extends Category {
  nominees: Nominee[]
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<CategoryWithNominees[]>([])
  const [votingSettings, setVotingSettings] = useState<VotingSettingsType | null>(null)
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalNominees: 0,
    totalVotes: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Simple admin check - in production, you'd want proper role-based access
  const isAdmin = session?.user?.email === 'admin@example.com' // Replace with your admin logic

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Load admin data
  useEffect(() => {
    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [categoriesData, settingsData, statsData] = await Promise.all([
        getCategoriesWithNominees(),
        getVotingSettings(),
        getAdminStats()
      ])
      
      setCategories(categoriesData)
      setVotingSettings(settingsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load admin data:', error)
      setError(error instanceof DatabaseError ? error.message : 'Failed to load admin data')
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading admin panel...</span>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  // Admin access check (simplified - implement proper role checking in production)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have permission to access the admin panel.
              </p>
              <Button asChild>
                <a href="/">Go Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Admin Data</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadData}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage categories, nominees, and voting settings for the Community Gaming Awards.
          </p>
        </motion.div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="nominees">Nominees</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.totalCategories}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.totalNominees}</div>
                    <div className="text-sm text-muted-foreground">Nominees</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Vote className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.totalVotes}</div>
                    <div className="text-sm text-muted-foreground">Votes Cast</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Status</CardTitle>
                  <CardDescription>Overview of current voting status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span>Voting Status</span>
                      <Badge variant={votingSettings?.voting_open ? "success" : "destructive"}>
                        {votingSettings?.voting_open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    
                    {votingSettings?.voting_end_date && (
                      <div className="flex items-center justify-between">
                        <span>End Date</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(votingSettings.voting_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button onClick={() => setActiveTab("categories")} variant="outline">
                    Manage Categories
                  </Button>
                  <Button onClick={() => setActiveTab("nominees")} variant="outline">
                    Manage Nominees
                  </Button>
                  <Button onClick={() => setActiveTab("settings")} variant="outline">
                    Voting Settings
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/results">View Results</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoryManager 
              categories={categories} 
              onUpdate={loadData} 
            />
          </TabsContent>

          {/* Nominees Tab */}
          <TabsContent value="nominees">
            <NomineeManager 
              categories={categories} 
              onUpdate={loadData} 
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <VotingSettings 
              settings={votingSettings} 
              onUpdate={loadData} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}



