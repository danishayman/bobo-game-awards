'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { Settings, Users, Trophy, BarChart3, Plus, Edit } from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function AdminDashboard() {
  const { appUser, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalNominees: 0
  })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!appUser || !appUser.is_admin)) {
      router.push('/')
      return
    }

    if (appUser?.is_admin) {
      fetchData()
    }
  }, [appUser, loading])

  const fetchData = async () => {
    try {
      // Fetch categories with nominees
      const categoriesRes = await fetch('/api/categories?include_nominees=true')
      const categoriesData = await categoriesRes.json()
      
      // Fetch results for vote counts
      const resultsRes = await fetch('/api/results')
      const resultsData = await resultsRes.json()

      setCategories(categoriesData.categories || [])
      
      // Calculate stats
      const totalCategories = categoriesData.categories?.length || 0
      const totalNominees = categoriesData.categories?.reduce(
        (sum: number, cat: any) => sum + (cat.nominees?.length || 0), 0
      ) || 0
      
      const totalVotes = resultsData.results?.reduce(
        (sum: number, cat: any) => sum + cat.nominees.reduce(
          (catSum: number, nom: any) => catSum + nom.vote_count, 0
        ), 0
      ) || 0

      setStats({
        totalVotes,
        totalUsers: 0, // Would need separate API call
        totalCategories,
        totalNominees
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || loadingData) {
    return <PageSkeleton variant="admin-dashboard" />
  }

  if (!appUser?.is_admin) {
    return (
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage categories, nominees, and view voting analytics
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nominees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNominees}</div>
            <p className="text-xs text-muted-foreground">
              Total nominees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/results">View Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/categories">Manage All</Link>
          </Button>
        </div>
        
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/categories/${category.slug}`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{category.nominees?.length || 0} nominees</span>
                  <span>Order: {category.display_order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/nominees">
                <Users className="h-4 w-4 mr-2" />
                Manage Nominees
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/results">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Live Results
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
