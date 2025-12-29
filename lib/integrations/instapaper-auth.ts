import crypto from 'crypto'

interface OAuthParams {
  oauth_consumer_key: string
  oauth_nonce: string
  oauth_signature_method: string
  oauth_timestamp: string
  oauth_version: string
  oauth_token?: string
  [key: string]: string | undefined
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

  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString()
  }

  private createSignatureBaseString(method: string, url: string, params: OAuthParams): string {
    // Sort parameters alphabetically by key
    const sortedParams = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${this.percentEncode(key)}=${this.percentEncode(value!)}`)
      .join('&')

    const signatureBaseString = [
      method.toUpperCase(),
      this.percentEncode(url),
      this.percentEncode(sortedParams)
    ].join('&')

    return signatureBaseString
  }

  private generateSignature(method: string, url: string, params: OAuthParams): string {
    const signatureBaseString = this.createSignatureBaseString(method, url, params)
    const signingKey = `${this.percentEncode(this.consumerSecret)}&${this.percentEncode(this.tokenSecret || '')}`

    console.log('Signature Debug:', {
      signatureBaseString,
      signingKeyPreview: signingKey.substring(0, 20) + '...'
    })

    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64')

    return signature
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

    // Merge OAuth params with additional params for signature calculation
    const allParams = { ...oauthParams, ...additionalParams }
    const signature = this.generateSignature(method, url, allParams)

    // Build Authorization header with OAuth params only
    const authParams: Record<string, string> = {
      ...oauthParams,
      oauth_signature: signature
    }

    const authHeader = Object.entries(authParams)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${this.percentEncode(value)}"`)
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

    // Generate OAuth authorization header WITHOUT xAuth params in signature
    // xAuth params are only sent in the body, not used for signature calculation
    const authHeader = this.generateAuthHeader('POST', url)

    console.log('xAuth Request:', {
      url,
      method: 'POST',
      authHeader,
      consumerKey: this.consumerKey
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