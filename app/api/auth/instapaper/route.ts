import { NextRequest, NextResponse } from 'next/server'
import { InstapaperAuth } from '@/lib/integrations/instapaper-auth'

// GET /api/auth/instapaper - Start OAuth flow
export async function GET() {
  try {
    const auth = new InstapaperAuth()
    const { token, tokenSecret, authUrl } = await auth.getRequestToken()
    
    // In production, store these in a secure session/database
    // For now, we'll return them to be stored client-side temporarily
    const response = NextResponse.json({ 
      success: true, 
      authUrl,
      requestToken: token,
      requestTokenSecret: tokenSecret 
    })
    
    // Set secure cookies for the request tokens
    response.cookies.set('instapaper_request_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 900 // 15 minutes
    })
    
    response.cookies.set('instapaper_request_token_secret', tokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 900 // 15 minutes
    })
    
    return response
  } catch (error) {
    console.error('Instapaper OAuth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initiate OAuth flow' 
    }, { status: 500 })
  }
}

// POST /api/auth/instapaper - Complete OAuth flow
export async function POST(request: NextRequest) {
  try {
    const { oauth_verifier } = await request.json()
    
    if (!oauth_verifier) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing oauth_verifier' 
      }, { status: 400 })
    }
    
    // Get request tokens from cookies
    const requestToken = request.cookies.get('instapaper_request_token')?.value
    const requestTokenSecret = request.cookies.get('instapaper_request_token_secret')?.value
    
    if (!requestToken || !requestTokenSecret) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing request tokens' 
      }, { status: 400 })
    }
    
    const auth = new InstapaperAuth()
    const { token, tokenSecret } = await auth.getAccessToken(
      requestToken, 
      requestTokenSecret, 
      oauth_verifier
    )
    
    // In production, store these securely for the user
    console.log('Access tokens obtained:', { token, tokenSecret })
    console.log('Add these to your .env.local:')
    console.log(`INSTAPAPER_TOKEN=${token}`)
    console.log(`INSTAPAPER_TOKEN_SECRET=${tokenSecret}`)
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Authentication successful! Check server logs for tokens.' 
    })
    
    // Clear request token cookies
    response.cookies.delete('instapaper_request_token')
    response.cookies.delete('instapaper_request_token_secret')
    
    return response
  } catch (error) {
    console.error('Instapaper OAuth completion error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to complete OAuth flow' 
    }, { status: 500 })
  }
}