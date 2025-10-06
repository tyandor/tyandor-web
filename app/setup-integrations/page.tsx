'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SetupIntegrationsPage() {
  const [instapaperStatus, setInstapaperStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [instapaperUsername, setInstapaperUsername] = useState('')
  const [instapaperPassword, setInstapaperPassword] = useState('')
  const [snipdApiKey, setSnipdApiKey] = useState('')
  const [message, setMessage] = useState('')

  const checkInstapaperStatus = async () => {
    try {
      const response = await fetch('/api/auth/instapaper')
      const data = await response.json()

      if (data.success && data.isAuthenticated) {
        setInstapaperStatus('success')
        setMessage('Instapaper is already connected!')
      } else {
        setMessage(data.message || 'Instapaper is not connected')
      }
    } catch (error) {
      console.error('Error checking Instapaper status:', error)
      setMessage('Failed to check Instapaper connection status')
    }
  }

  const handleInstapaperAuth = async () => {
    if (!instapaperUsername || !instapaperPassword) {
      setMessage('Please enter both username and password')
      return
    }

    setInstapaperStatus('loading')
    try {
      const response = await fetch('/api/auth/instapaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: instapaperUsername,
          password: instapaperPassword
        })
      })

      const data = await response.json()
      setMessage(data.message || data.error)
      setInstapaperStatus(data.success ? 'success' : 'error')

      if (data.success) {
        // Clear sensitive data from state
        setInstapaperPassword('')
      }
    } catch (error) {
      console.error('Error authenticating with Instapaper:', error)
      setInstapaperStatus('error')
      setMessage('Failed to authenticate with Instapaper')
    }
  }

  const testSnipdConnection = async () => {
    if (!snipdApiKey) {
      setMessage('Please enter your Snipd API key')
      return
    }

    try {
      // Test the API key by making a simple request
      const response = await fetch('https://api.snipd.com/v1/snippets?limit=1', {
        headers: {
          'Authorization': `Bearer ${snipdApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setMessage(`Snipd API key is valid! Add this to your .env.local: SNIPD_API_KEY=${snipdApiKey}`)
      } else {
        setMessage('Invalid Snipd API key')
      }
    } catch (error) {
      console.error('Error testing Snipd API:', error)
      setMessage('Failed to test Snipd API key')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Setup Integrations</h1>
        <p className="text-gray-600 mt-2">Configure your Instapaper and Snipd connections</p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Instapaper Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Instapaper</CardTitle>
            <CardDescription>
              Connect your Instapaper account to sync bookmarks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Step 1: Create Instapaper App</Label>
              <p className="text-sm text-gray-600">
                Go to <a href="https://www.instapaper.com/main/request_oauth_consumer_token" className="text-blue-600 hover:underline" target="_blank">Instapaper Developer</a> to create an app and get your consumer key/secret.
              </p>
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> When requesting your tokens, you must specifically ask for <strong>xAuth access</strong> in your application description. Standard OAuth apps won't work for this integration.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Step 2: Add to .env.local</Label>
              <pre className="text-xs bg-gray-100 p-2 rounded">
{`INSTAPAPER_CONSUMER_KEY=your_key
INSTAPAPER_CONSUMER_SECRET=your_secret`}
              </pre>
            </div>

            <div className="space-y-2">
              <Label>Step 3: Check Connection</Label>
              <Button
                onClick={checkInstapaperStatus}
                variant="outline"
                className="w-full"
              >
                Check Connection Status
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instapaper-username">Step 4: Enter Credentials</Label>
              <Input
                id="instapaper-username"
                type="text"
                placeholder="Instapaper username"
                value={instapaperUsername}
                onChange={(e) => setInstapaperUsername(e.target.value)}
              />
              <Input
                id="instapaper-password"
                type="password"
                placeholder="Instapaper password"
                value={instapaperPassword}
                onChange={(e) => setInstapaperPassword(e.target.value)}
              />
              <p className="text-xs text-gray-600">
                Your credentials are sent directly to Instapaper and not stored on this server.
              </p>
              <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <p className="text-sm text-red-800">
                  <strong>Getting 403 Forbidden?</strong> This usually means:
                </p>
                <ul className="text-xs text-red-700 mt-1 list-disc list-inside">
                  <li>Your consumer tokens haven't been approved yet</li>
                  <li>xAuth wasn't requested/enabled for your app</li>
                  <li>Check the server console for more debug information</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleInstapaperAuth}
              disabled={instapaperStatus === 'loading'}
              className="w-full"
            >
              {instapaperStatus === 'loading' ? 'Authenticating...' : 'Get Access Tokens'}
            </Button>
          </CardContent>
        </Card>

        {/* Snipd Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Snipd</CardTitle>
            <CardDescription>
              Connect your Snipd account to access podcast snippets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Step 1: Get API Key</Label>
              <p className="text-sm text-gray-600">
                Get your API key from <a href="https://snipd.com/developers" className="text-blue-600 hover:underline" target="_blank">Snipd Developers</a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="snipd-key">Step 2: Enter API Key</Label>
              <Input
                id="snipd-key"
                type="password"
                placeholder="Your Snipd API key"
                value={snipdApiKey}
                onChange={(e) => setSnipdApiKey(e.target.value)}
              />
            </div>

            <Button 
              onClick={testSnipdConnection}
              className="w-full"
            >
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          After setup, you can use the integrations in your components and pages.
        </p>
      </div>
    </div>
  )
}