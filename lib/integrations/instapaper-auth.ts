import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

export class InstapaperAuth {
  private consumerKey: string
  private consumerSecret: string
  private token?: string
  private tokenSecret?: string
  private oauth: OAuth

  constructor() {
    this.consumerKey = process.env.INSTAPAPER_CONSUMER_KEY!
    this.consumerSecret = process.env.INSTAPAPER_CONSUMER_SECRET!
    this.token = process.env.INSTAPAPER_TOKEN
    this.tokenSecret = process.env.INSTAPAPER_TOKEN_SECRET

    // Initialize OAuth 1.0a client
    this.oauth = new OAuth({
      consumer: {
        key: this.consumerKey,
        secret: this.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
      },
    })
  }

  public generateAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
    const requestData = {
      url,
      method,
      data: additionalParams,
    }

    const token = this.token ? {
      key: this.token,
      secret: this.tokenSecret || '',
    } : undefined

    const authHeader = this.oauth.toHeader(this.oauth.authorize(requestData, token))
    return authHeader.Authorization
  }

  // xAuth: Direct username/password exchange for access tokens
  public async getAccessTokenWithCredentials(username: string, password: string): Promise<{ token: string; tokenSecret: string }> {
    const url = 'https://www.instapaper.com/api/1/oauth/access_token'
    const xAuthParams = {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: 'client_auth'
    }

    // Generate auth header without xAuth params - they should NOT be included in the signature
    const authHeader = this.generateAuthHeader('POST', url)

    // Debug logging
    console.log('xAuth request details:', {
      url,
      consumerKey: this.consumerKey,
      hasConsumerSecret: !!this.consumerSecret,
      authHeaderLength: authHeader.length,
      authHeaderPreview: authHeader.substring(0, 100) + '...'
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(xAuthParams),
    })

    console.log('Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      throw new Error(`Instapaper authentication failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const responseText = await response.text()
    const params = new URLSearchParams(responseText)

    const token = params.get('oauth_token')
    const tokenSecret = params.get('oauth_token_secret')

    if (!token || !tokenSecret) {
      throw new Error('Invalid response from Instapaper: missing tokens')
    }

    return {
      token,
      tokenSecret
    }
  }

  // Verify credentials with existing access tokens
  public async verifyCredentials(): Promise<boolean> {
    if (!this.token || !this.tokenSecret) {
      return false
    }

    try {
      const url = 'https://www.instapaper.com/api/1/account/verify_credentials'
      const authHeader = this.generateAuthHeader('POST', url)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      return response.ok
    } catch (error) {
      console.error('Error verifying Instapaper credentials:', error)
      return false
    }
  }
}