'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Save, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { updateVotingSettings } from '@/lib/admin-queries'
import { type VotingSettings } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface VotingSettingsProps {
  settings: VotingSettings | null
  onUpdate: () => void
}

export function VotingSettings({ settings, onUpdate }: VotingSettingsProps) {
  const [formData, setFormData] = useState({
    votingOpen: true,
    votingEndDate: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData({
        votingOpen: settings.voting_open,
        votingEndDate: settings.voting_end_date 
          ? new Date(settings.voting_end_date).toISOString().slice(0, 16)
          : ''
      })
    }
  }, [settings])

  const handleSave = async () => {
    try {
      setLoading(true)
      await updateVotingSettings(
        formData.votingOpen, 
        formData.votingEndDate || undefined
      )
      onUpdate()
      toast.success('Voting settings updated successfully')
    } catch (error) {
      console.error('Failed to update voting settings:', error)
      toast.error('Failed to update voting settings')
    } finally {
      setLoading(false)
    }
  }

  const toggleVoting = () => {
    setFormData({ ...formData, votingOpen: !formData.votingOpen })
  }

  const votingEndDate = formData.votingEndDate ? new Date(formData.votingEndDate) : null
  const isVotingEnded = votingEndDate ? new Date() > votingEndDate : false
  const effectiveStatus = formData.votingOpen && !isVotingEnded

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Voting Settings</h2>
        <p className="text-muted-foreground">Control when voting is open and when it ends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Voting Status</span>
              <Badge variant={effectiveStatus ? "success" : "destructive"}>
                {effectiveStatus ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Open
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Closed
                  </>
                )}
              </Badge>
            </div>

            {votingEndDate && (
              <div className="space-y-2">
                <span className="font-medium">End Date</span>
                <div className="text-sm text-muted-foreground">
                  {votingEndDate.toLocaleDateString()} at {votingEndDate.toLocaleTimeString()}
                </div>
                {isVotingEnded && (
                  <Badge variant="destructive" className="text-xs">
                    Voting period has ended
                  </Badge>
                )}
              </div>
            )}

            {settings?.updated_at && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Last updated: {new Date(settings.updated_at).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Update Settings</span>
            </CardTitle>
            <CardDescription>
              Configure voting availability and duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voting Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Voting Open</Label>
                <p className="text-xs text-muted-foreground">
                  Allow users to cast votes
                </p>
              </div>
              <Button
                variant={formData.votingOpen ? "default" : "outline"}
                size="sm"
                onClick={toggleVoting}
              >
                {formData.votingOpen ? "Open" : "Closed"}
              </Button>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Voting End Date (Optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.votingEndDate}
                onChange={(e) => setFormData({ ...formData, votingEndDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground">
                Voting will automatically close at this time
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How users will see the voting status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="font-medium">Voting Status</span>
                <Badge variant={effectiveStatus ? "success" : "destructive"}>
                  {effectiveStatus ? "Open" : "Closed"}
                </Badge>
              </div>
              
              {votingEndDate && formData.votingOpen && !isVotingEnded && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Voting ends: {votingEndDate.toLocaleDateString()} at {votingEndDate.toLocaleTimeString()}
                </div>
              )}
              
              {isVotingEnded && (
                <div className="mt-2 text-sm text-destructive">
                  Voting period has ended
                </div>
              )}
              
              {!formData.votingOpen && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Voting is currently disabled
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
