'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { type Category, type Nominee } from '@/lib/supabase'
import { createCategory, updateCategory, deleteCategory } from '@/lib/admin-queries'
import toast from 'react-hot-toast'

interface CategoryManagerProps {
  categories: (Category & { nominees: Nominee[] })[]
  onUpdate: () => void
}

export function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await createCategory(formData.name.trim(), formData.description.trim())
      setFormData({ name: '', description: '' })
      setIsCreating(false)
      onUpdate()
      toast.success('Category created successfully')
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error('Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await updateCategory(id, formData.name.trim(), formData.description.trim())
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      onUpdate()
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all nominees in this category.`)) {
      return
    }

    try {
      setLoading(true)
      await deleteCategory(id)
      onUpdate()
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category.id)
    setFormData({ name: category.name, description: category.description })
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({ name: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-muted-foreground">Manage voting categories</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          disabled={isCreating || editingCategory !== null}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreate} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            {editingCategory === category.id ? (
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-name-${category.id}`}>Name</Label>
                  <Input
                    id={`edit-name-${category.id}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                  <Textarea
                    id={`edit-description-${category.id}`}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleUpdate(category.id)} 
                    disabled={loading}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {category.nominees.length} nominees
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(category)}
                        disabled={loading || isCreating || editingCategory !== null}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={loading || isCreating || editingCategory !== null}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </>
            )}
          </Card>
        ))}
      </div>

      {categories.length === 0 && !isCreating && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No categories created yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



