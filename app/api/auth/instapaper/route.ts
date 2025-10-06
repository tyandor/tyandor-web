import { NextRequest, NextResponse } from 'next/server'
import { InstapaperAuth } from '@/lib/integrations/instapaper-auth'

// GET /api/auth/instapaper - Check if credentials exist and verify them
export async function GET() {
  try {
    const auth = new InstapaperAuth()
    const isValid = await auth.verifyCredentials()

    return NextResponse.json({
      success: true,
      isAuthenticated: isValid,
      message: isValid ? 'Instapaper is connected' : 'Instapaper is not connected or tokens are invalid'
    })
  } catch (error) {
    console.error('Error checking Instapaper credentials:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check authentication status'
    }, { status: 500 })
  }
}

// POST /api/auth/instapaper - Authenticate with username/password using xAuth
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 })
    }

    // Debug: Check environment variables
    const consumerKey = process.env.INSTAPAPER_CONSUMER_KEY
    const consumerSecret = process.env.INSTAPAPER_CONSUMER_SECRET

    console.log('Environment check:', {
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      keyLength: consumerKey?.length,
      secretLength: consumerSecret?.length
    })

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing INSTAPAPER_CONSUMER_KEY or INSTAPAPER_CONSUMER_SECRET in environment variables'
      }, { status: 500 })
    }

    const auth = new InstapaperAuth()
    const { token, tokenSecret } = await auth.getAccessTokenWithCredentials(username, password)

    // In production, store these securely for the user
    console.log('Access tokens obtained:', { token, tokenSecret })
    console.log('Add these to your .env.local:')
    console.log(`INSTAPAPER_TOKEN=${token}`)
    console.log(`INSTAPAPER_TOKEN_SECRET=${tokenSecret}`)

    return NextResponse.json({
      success: true,
      message: 'Authentication successful! Check server logs for tokens.',
      tokens: {
        token: token.substring(0, 8) + '...', // Only show partial token for security
        tokenSecret: tokenSecret.substring(0, 8) + '...'
      }
    })
  } catch (error) {
    console.error('Instapaper xAuth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to authenticate with Instapaper'
    }, { status: 500 })
  }
}