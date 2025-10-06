import crypto from 'crypto'

interface OAuthParams {
  oauth_consumer_key: string
  oauth_nonce: string
  oauth_signature_method: string
  oauth_timestamp: string
  oauth_version: string
  oauth_token?: string
}

export class InstapaperAuth {
  private consumerKey: string
  private consumerSecret: string
  private token?: string
  private tokenSecret?: string

  constructor() {
    this.consumerKey = process.env.INSTAPAPER_CONSUMER_KEY!
    this.consumerSecret = process.env.INSTAPAPER_CONSUMER_SECRET!
    this.token = process.env.INSTAPAPER_TOKEN
    this.tokenSecret = process.env.INSTAPAPER_TOKEN_SECRET
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString()
  }

  private generateSignature(method: string, url: string, params: OAuthParams): string {
    const baseString = this.createSignatureBaseString(method, url, params)
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.tokenSecret || '')}`
    
    return crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64')
  }

  private createSignatureBaseString(method: string, url: string, params: OAuthParams): string {
    const sortedParams = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    return `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`
  }

  public generateAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
    const oauthParams: OAuthParams = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: this.generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: this.generateTimestamp(),
      oauth_version: '1.0',
    }

    if (this.token) {
      oauthParams.oauth_token = this.token
    }

    const allParams = { ...oauthParams, ...additionalParams }
    const signature = this.generateSignature(method, url, allParams)

    const authParams = {
      ...oauthParams,
      oauth_signature: signature
    }

    const authHeader = Object.entries(authParams)
      .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
      .join(', ')

    return `OAuth ${authHeader}`
  }

  // xAuth: Direct username/password exchange for access tokens
  public async getAccessTokenWithCredentials(username: string, password: string): Promise<{ token: string; tokenSecret: string }> {
    const url = 'https://www.instapaper.com/api/1/oauth/access_token'
    const xAuthParams = {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: 'client_auth'
    }

    const authHeader = this.generateAuthHeader('POST', url, xAuthParams)

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