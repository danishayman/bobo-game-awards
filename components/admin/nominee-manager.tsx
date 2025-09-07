'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react'
import { type Category, type Nominee } from '@/lib/supabase'
import { createNominee, updateNominee, deleteNominee } from '@/lib/admin-queries'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface NomineeManagerProps {
  categories: (Category & { nominees: Nominee[] })[]
  onUpdate: () => void
}

export function NomineeManager({ categories, onUpdate }: NomineeManagerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [editingNominee, setEditingNominee] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)
  const nominees = selectedCategory?.nominees || []

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.imageUrl.trim() || !formData.categoryId) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await createNominee(
        formData.categoryId,
        formData.title.trim(),
        formData.description.trim(),
        formData.imageUrl.trim()
      )
      setFormData({ categoryId: '', title: '', description: '', imageUrl: '' })
      setIsCreating(false)
      onUpdate()
      toast.success('Nominee created successfully')
    } catch (error) {
      console.error('Failed to create nominee:', error)
      toast.error('Failed to create nominee')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.imageUrl.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await updateNominee(id, formData.title.trim(), formData.description.trim(), formData.imageUrl.trim())
      setEditingNominee(null)
      setFormData({ categoryId: '', title: '', description: '', imageUrl: '' })
      onUpdate()
      toast.success('Nominee updated successfully')
    } catch (error) {
      console.error('Failed to update nominee:', error)
      toast.error('Failed to update nominee')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      setLoading(true)
      await deleteNominee(id)
      onUpdate()
      toast.success('Nominee deleted successfully')
    } catch (error) {
      console.error('Failed to delete nominee:', error)
      toast.error('Failed to delete nominee')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (nominee: Nominee) => {
    setEditingNominee(nominee.id)
    setFormData({
      categoryId: nominee.category_id,
      title: nominee.title,
      description: nominee.description,
      imageUrl: nominee.image_url
    })
    setIsCreating(false)
    setImageError(null)
  }

  const startCreate = () => {
    setIsCreating(true)
    setFormData({
      categoryId: selectedCategoryId,
      title: '',
      description: '',
      imageUrl: ''
    })
    setEditingNominee(null)
    setImageError(null)
  }

  const cancelEdit = () => {
    setEditingNominee(null)
    setIsCreating(false)
    setFormData({ categoryId: '', title: '', description: '', imageUrl: '' })
    setImageError(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nominees</h2>
          <p className="text-muted-foreground">Manage nominees for each category</p>
        </div>
      </div>

      {/* Category Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
          <CardDescription>Choose a category to manage its nominees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(category.id)}
                className="relative"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.nominees.length}
                </Badge>
              </Button>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-muted-foreground">No categories available. Create categories first.</p>
          )}
        </CardContent>
      </Card>

      {selectedCategoryId && (
        <>
          {/* Add Nominee Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {selectedCategory?.name} Nominees
            </h3>
            <Button 
              onClick={startCreate}
              disabled={isCreating || editingNominee !== null}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Nominee
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
                  <CardTitle>Create New Nominee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Nominee title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Nominee description"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value })
                            setImageError(null)
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {formData.imageUrl && !imageError ? (
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            onError={() => setImageError('Failed to load image')}
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                            {imageError || 'Image preview will appear here'}
                          </div>
                        )}
                      </div>
                    </div>
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

          {/* Nominees List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nominees.map((nominee) => (
              <Card key={nominee.id}>
                {editingNominee === nominee.id ? (
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value })
                          setImageError(null)
                        }}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleUpdate(nominee.id)} 
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
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={nominee.image_url}
                        alt={nominee.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg line-clamp-1">{nominee.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(nominee)}
                            disabled={loading || isCreating || editingNominee !== null}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(nominee.id, nominee.title)}
                            disabled={loading || isCreating || editingNominee !== null}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {nominee.description}
                      </CardDescription>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>

          {nominees.length === 0 && !isCreating && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No nominees in this category yet.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
